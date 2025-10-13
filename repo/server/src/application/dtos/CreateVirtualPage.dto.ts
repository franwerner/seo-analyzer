import { z } from "zod"
import pathnameScheme from "../shared/schemes/pathname.scheme"


const createVirtualPageScheme = z.object({
    virtualWebId: z.number(),
    pathname: pathnameScheme
})

export default createVirtualPageScheme

export type CreateVirtualPageDTO = z.infer<typeof createVirtualPageScheme>
