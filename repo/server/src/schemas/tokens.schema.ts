import z from "zod"

const tokensSchema = z.object({
    input: z.number(),
    output: z.number()
})

export type Tokens = z.infer<typeof tokensSchema>
export default tokensSchema
