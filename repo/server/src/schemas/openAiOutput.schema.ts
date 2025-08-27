import { z } from "zod"
import openAiInputSchema from "./openAiInput.schema"

const openAiOutputSchema = z.object({
    tokens: z.object({
        input: z.number(),
        output: z.number()
    }),
    ...openAiInputSchema.shape
})

export default openAiOutputSchema