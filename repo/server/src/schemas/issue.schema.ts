import { z } from "zod"
import issueType, { IssueType } from "./issueType.schema"

const issueSchema = z.object({
    message: z.string(),
    tag: z.string(),
    traceIds: z.array(z.string()),
    type: issueType.default(IssueType.GENERAL),
})

export const issueSchemaWithOutType = issueSchema.omit({ type: true })

export type Issue = z.infer<typeof issueSchema>

export default issueSchema