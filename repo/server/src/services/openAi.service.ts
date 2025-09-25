import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import openAiInputSchema from "../schemas/openAiInput.schema";
import openAiOutputSchema from "../schemas/openAiOutput.schema";



class OpenAi {
    openAI: OpenAI
    constructor() {
        this.openAI = new OpenAI({
            apiKey: process.env.OPENAI_KEY,
        })
    }

    static validateOuput(response: OpenAI.Responses.Response) {
        const parsed = JSON.parse(response.output_text)
        const { usage } = response
        return openAiOutputSchema.parse({
            issues: parsed.issues,
            tokens: {
                input: usage?.input_tokens,
                output: usage?.output_tokens
            }
        })
    }

    async createResponse({
        instructions,
        input
    }: {
        instructions: string,
        input: string
    }) {
        const response = await this.openAI.responses.create({
            model: "gpt-5-mini",
            instructions,
            input,
        })
        return {
            tokens: {
                input: response.usage?.input_tokens || 0,
                output: response.usage?.output_tokens || 0
            },
            output: response.output_text
        }
    }

    async generateIssues(input: string, instructions: string) {

        const response = await this.openAI.responses.create({
            model: "gpt-5-mini",
            text: {
                format: zodTextFormat(openAiInputSchema, "issues")
            },
            instructions,
            input: input,
        },

        )

        return OpenAi.validateOuput(response)
    }



}

export default OpenAi