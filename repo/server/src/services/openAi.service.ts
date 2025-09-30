import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import openAiInputSchema from "../schemas/openAiInput.schema";
import z from "zod"

const WordSchema = z.object({
    words: z.array(z.string())
})

class OpenAi {
    openAI: OpenAI
    constructor() {
        this.openAI = new OpenAI({
            apiKey: process.env.OPENAI_KEY,
        })
    }

    async generateIssueWords(input: string) {
        const response = await this.openAI.responses.create({
            model: "gpt-5-mini",
            instructions: `
            Eres un asistente de corrección ortográfica.

        # Instrucciones:
        1. Analiza el TEXTO proporcionado y detecta únicamente palabras con errores **ortográficos**.
        2. Ignora por completo la gramática, sintaxis, puntuación, redacción o palabras mal empleadas en contexto. SOLO revisa si la palabra está mal escrita.
        3. No incluyas explicaciones, definiciones ni texto adicional fuera del Array.
        4. No marques como error:
        - Abreviaturas válidas (ej: "etc.", "Sr.", "Dr.", "vs.")
        - Siglas o acrónimos en mayúsculas (ej: "ONU", "NASA")
        - Palabras técnicas correctamente escritas.
        5. Cada palabra debe aparecer solo una vez en el Array, aunque se repita en el texto.

            `,
            input,
            text: {
                format: zodTextFormat(WordSchema, "words")
            }
        })

        return {
            words: WordSchema.parse(JSON.parse(response.output_text)).words,
            tokens: {
                input: response.usage?.input_tokens || 0,
                output: response.usage?.output_tokens || 0
            }
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

        return {
            issues: openAiInputSchema.parse(JSON.parse(response.output_text)).issues,
            tokens: {
                input: response.usage?.input_tokens,
                output: response.usage?.output_tokens
            }
        }
    }



}

export default OpenAi