import { z } from "zod"
import issuesSchema from "./issues.schema"

const openAiInputSchema = z.object({
    issues: issuesSchema,
})

export default openAiInputSchema