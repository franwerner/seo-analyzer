import hostScheme from "./schemes/host.scheme"
import pathnameScheme from "./schemes/pathname.scheme"
import { z } from "zod"


export const createVirtualWebScheme = z.object({
    host: hostScheme,
    mainPathname: pathnameScheme,
})

export type CreateVirtualWebDTO = z.infer<typeof createVirtualWebScheme>
