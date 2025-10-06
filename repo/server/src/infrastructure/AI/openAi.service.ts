import { IssueType } from "@/infrastructure/schemas/issueType.schema";
import { issueOutputSchema, issueOutputWithOutTypeSchema } from "@/infrastructure/schemas/openAiOutput.schema";
import WordsSchema from "@/infrastructure/schemas/words.schema";
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";

class OpenAi {
  openAI: OpenAI
  constructor() {
    this.openAI = new OpenAI({
      apiKey: process.env.OPENAI_KEY,
    })
  }

  static getTokenUsage(response: OpenAI.Responses.Response) {
    return {
      input: response.usage?.input_tokens || 0,
      output: response.usage?.output_tokens || 0
    }
  }

  async createBasicResponse(input: string, instructions: string) {
    const response = await this.openAI.responses.create({
      model: "gpt-5-mini",
      instructions,
      input,
    })
    return {
      response: response.output_text,
      tokens: OpenAi.getTokenUsage(response)
    }
  }

  async generateIssueWords(input: string, instructions: string) {
    const response = await this.openAI.responses.create({
      model: "gpt-5-mini",
      instructions,
      input,
      text: {
        format: zodTextFormat(WordsSchema, "words")
      }
    })

    return {
      words: WordsSchema.parse(JSON.parse(response.output_text)).words,
      tokens: OpenAi.getTokenUsage(response)
    }
  }


  async generateIssuesAsType(
    input: string,
    instructions: string,
    type: IssueType
  ) {

    const response = await this.openAI.responses.create({
      model: "gpt-5-mini",
      instructions,
      input,
      text: {
        format: zodTextFormat(issueOutputWithOutTypeSchema, "issues")
      }
    })

    const outputIssues = issueOutputWithOutTypeSchema.parse(JSON.parse(response.output_text)).issues
    const issues = outputIssues.map(issue => ({ ...issue, type }))

    return {
      issues,
      tokens: OpenAi.getTokenUsage(response)
    }

  }


  async generateIssues(input: string, instructions: string) {

    const response = await this.openAI.responses.create({
      model: "gpt-5-mini",
      text: {
        format: zodTextFormat(issueOutputSchema, "issues")
      },
      instructions,
      input,
    })

    return {
      issues: issueOutputSchema.parse(JSON.parse(response.output_text)).issues,
      tokens: OpenAi.getTokenUsage(response)
    }
  }



}

export default OpenAi