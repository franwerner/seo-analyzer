import { z } from "zod"
import issueSchema, { issueSchemaWithOutType } from "./issue.schema"
import tokensSchema from "./tokens.schema"


const issueOutputSchema = z.object({
    tokens: tokensSchema,
    issues: z.array(issueSchema)
})


const issueOutputWithOutTypeSchema = z.object({
    tokens: tokensSchema,
    issues: z.array(issueSchemaWithOutType)
})

export { issueOutputWithOutTypeSchema, issueOutputSchema }