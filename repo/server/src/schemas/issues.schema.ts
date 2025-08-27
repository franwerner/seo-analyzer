import { z } from "zod"

const issuesSchema = z.array(z.object({
    message: z.string(),
    tag: z.string(),
    traceIds: z.array(z.string())
}))

export type Issues = z.infer<typeof issuesSchema>
export default issuesSchema