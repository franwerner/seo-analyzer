import { z } from "zod"
import pathnameScheme from "../shared/schemes/pathname.scheme"


const createVirtualDomScheme = z.object({
    virtualWebId: z.number(),
    pathname: pathnameScheme
})

export default createVirtualDomScheme

export type CreateVirtualDomDTO = z.infer<typeof createVirtualDomScheme>
