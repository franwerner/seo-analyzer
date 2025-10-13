import hostScheme from "@/application/shared/schemes/host.scheme"
import pathnameScheme from "@/application/shared/schemes/pathname.scheme"
import { z } from "zod"


const createVirtualWebScheme = z.object({
    host: hostScheme,
    mainPathname: pathnameScheme,
})

export default createVirtualWebScheme

export type CreateVirtualWebDTO = z.infer<typeof createVirtualWebScheme>
