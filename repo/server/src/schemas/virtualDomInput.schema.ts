import { z } from "zod"

const virtualDomInputSchema = z.object({
    url: z.string().transform((val) => {
        if (!/^https?:\/\//i.test(val)) {
            return `https://${val}`;
        }
        return val;
    })
})

export type VirtualDomInput = z.infer<typeof virtualDomInputSchema>
export default virtualDomInputSchema