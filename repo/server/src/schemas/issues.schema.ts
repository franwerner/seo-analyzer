import { z } from "zod"

const issueSchema = z.object({
    message: z.string(),
    tag: z.string(),
    traceIds: z.array(z.string()),
    type: z.enum(["schema", "semantic", "spelling", "general", "link", "structure"]),
})

export type Issue = z.infer<typeof issueSchema>
const issuesSchema = z.array(issueSchema)

export default issuesSchema