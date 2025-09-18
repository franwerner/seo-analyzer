import { z } from "zod"

const issueSchema = z.object({
    message: z.string(),
    tag: z.string(),
    traceIds: z.array(z.string())
})
const issuesSchema = z.array(issueSchema)

export default issuesSchema