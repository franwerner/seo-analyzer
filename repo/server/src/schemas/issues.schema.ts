import { z } from "zod"

const issueSchema = z.object({
    message: z.string(),
    tag: z.string(),
    traceIds: z.array(z.string())
})
const issuesSchema = z.array(issueSchema)

export type Issues = z.infer<typeof issuesSchema>
export type Issue = z.infer<typeof issueSchema>
export default issuesSchema