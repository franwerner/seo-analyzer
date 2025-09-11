import { z } from "zod"


const virtualDomInputSchema = z.object({
    url: z.string().url(),
    exhaustive: z.boolean().default(false),
})

export type VirtualDomInput = z.infer<typeof virtualDomInputSchema>
export default virtualDomInputSchema