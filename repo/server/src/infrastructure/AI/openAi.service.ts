import WordsSchema from "@/infrastructure/AI/schemas/words.schema";
import { Usage, ValidationsType, ValidationTypeEnum } from "@seo-analyzer/common";
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { GPT5MiniModel, Model } from "./constant/models.constant";
import { issuesWithOutTypeSchema } from "./schemas/issue.schema";
import traceIdsSchema from "./schemas/traceIds.schema";

interface TokenUsage {
  input: number,
  output: number
}


class OpenAiService {
  openAI: OpenAI
  constructor(public model: Model = new GPT5MiniModel()) {
    this.openAI = new OpenAI({
      apiKey: process.env.OPENAI_KEY,
    })
  }

  calculateUsageTokens(usageTokens: TokenUsage): Usage {
    const { pricing } = this.model
    const priceInput = (usageTokens.input / 1_000_000) * pricing.input
    const priceOutput = (usageTokens.output / 1_000_000) * pricing.output
    return {
      input: priceInput,
      output: priceOutput,
      total: priceInput + priceOutput
    }
  }

  static getTokenUsage(response: OpenAI.Responses.Response): TokenUsage {
    return {
      input: response.usage?.input_tokens || 0,
      output: response.usage?.output_tokens || 0
    }
  }

  async createBasicResponse(input: string, instructions: string) {
    const response = await this.openAI.responses.create({
      model: this.model.name,
      instructions,
      input,
    })
    return {
      response: response.output_text,
      tokens: OpenAiService.getTokenUsage(response),
    }
  }


  async generateIssueTraceIds(input: string, instructions: string) {
    const response = await this.openAI.responses.create({
      model: this.model.name,
      instructions,
      input,
      text: {
        format: zodTextFormat(traceIdsSchema, "traceIds")
      }
    })

    return {
      traceIds: traceIdsSchema.parse(JSON.parse(response.output_text)).traceIds,
      tokens: OpenAiService.getTokenUsage(response),
    }
  }

  async generateIssueWords(input: string, instructions: string) {
    const response = await this.openAI.responses.create({
      model: this.model.name,
      instructions,
      input,
      text: {
        format: zodTextFormat(WordsSchema, "words")
      }
    })

    return {
      words: WordsSchema.parse(JSON.parse(response.output_text)).words,
      tokens: OpenAiService.getTokenUsage(response),
    }
  }


  async generateIssuesAsType(
    input: string,
    instructions: string,
    type: ValidationTypeEnum
  ) {

    const response = await this.openAI.responses.create({
      model: this.model.name,
      instructions,
      input,
      text: {
        format: zodTextFormat(issuesWithOutTypeSchema, "issues")
      }
    })

    const outputIssues = issuesWithOutTypeSchema.parse(JSON.parse(response.output_text)).issues
    const issues = outputIssues.map(issue => ({ ...issue, type }))

    return {
      issues,
      tokens: OpenAiService.getTokenUsage(response),
    }

  }

}

export default OpenAiService