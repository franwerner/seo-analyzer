import hostScheme from "../schemes/host.scheme"
import pathnameScheme from "../schemes/pathname.scheme"
import { z } from "zod"
import { virtualWebScheme } from "../schemes/virtualWeb.scheme"


export const createVirtualWebScheme = z.object({
    host: hostScheme,
    mainPathname: pathnameScheme,
})

export const createVirtualWebResponseScheme = virtualWebScheme

export type CreateVirtualWebDTO = z.infer<typeof createVirtualWebScheme>

export type CreateVirtualWebResponseDTO = z.infer<typeof createVirtualWebResponseScheme>

