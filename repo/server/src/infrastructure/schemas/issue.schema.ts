import { z } from "zod"

const issueSchema = z.object({
    message: z.string(),
    tag: z.string(),
    traceIds: z.array(z.string()),
    type: z.enum(["schema", "semantic", "spelling", "general", "resource", "structure"]),
})

export const issueSchemaWithOutType = issueSchema.omit({ type: true })

export type Issue = z.infer<typeof issueSchema>

export default issueSchema