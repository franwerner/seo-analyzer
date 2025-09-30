import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import openAiInputSchema from "../schemas/openAiInput.schema";
import WordsSchema from "@/schemas/words.schema";

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


  async generateIssues(input: string, instructions: string) {

    const response = await this.openAI.responses.create({
      model: "gpt-5-mini",
      text: {
        format: zodTextFormat(openAiInputSchema, "issues")
      },
      instructions,
      input,
    },
    )

    return {
      issues: openAiInputSchema.parse(JSON.parse(response.output_text)).issues,
      tokens: OpenAi.getTokenUsage(response)
    }
  }



}

export default OpenAi