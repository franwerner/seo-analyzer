import { z } from "zod"


const createVirtualPageScheme = z.object({
    virtualWebId: z.number(),
    pathname: z.string()
})

export default createVirtualPageScheme

export type CreateVirtualPageDTO = z.infer<typeof createVirtualPageScheme>
