import { ValidationTypeEnum } from "@packages/common"
import { z } from "zod"

const issueSchema = z.object({
    message: z.string(),
    tag: z.string(),
    traceIds: z.array(z.string()),
    type: z.nativeEnum(ValidationTypeEnum)
})


const issueSchemaWithOutType = issueSchema.omit({ type: true })

export const issuesWithOutTypeSchema = z.object({
    issues: z.array(issueSchemaWithOutType)
})

export default issueSchema