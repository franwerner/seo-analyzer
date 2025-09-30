import { z } from "zod"
import openAiInputSchema from "./openAiInput.schema"

const tokensSchema = z.object({
    input: z.number(),
    output: z.number()
})

const openAiOutputSchema = z.object({
    tokens: tokensSchema,
    ...openAiInputSchema.shape
})
export type Tokens = z.infer<typeof tokensSchema>
export default openAiOutputSchema