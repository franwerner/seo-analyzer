import { z } from "zod"
import issuesSchema from "./issues.schema"

const openAiInputSchema = z.object({
    issues: issuesSchema,
    feedback: z.array(z.string()),
})

export default openAiInputSchema