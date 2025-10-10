import ValidationType from "@/domain/virtual-dom/types/ValidationType.enum"
import { z } from "zod"

const issueSchema = z.object({
    message: z.string(),
    tag: z.string(),
    traceIds: z.array(z.string()),
    type: z.nativeEnum(ValidationType)
})


const issueSchemaWithOutType = issueSchema.omit({ type: true })

export const issuesWithOutTypeSchema = z.object({
    issues: z.array(issueSchemaWithOutType)
})

export default issueSchema