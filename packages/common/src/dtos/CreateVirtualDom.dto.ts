import { z } from "zod"
import pathnameScheme from "./schemes/pathname.scheme"


export const createVirtualDomScheme = z.object({
    virtualWebId: z.number(),
    pathname: pathnameScheme
})

export type CreateVirtualDomDTO = z.infer<typeof createVirtualDomScheme>
