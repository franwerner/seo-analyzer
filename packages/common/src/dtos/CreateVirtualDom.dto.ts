import { z } from "zod"
import pathnameScheme from "../schemes/pathname.scheme"
import { virtualDomScheme } from "@/schemes"


export const createVirtualDomScheme = z.object({
    virtualWebId: z.number(),
    pathname: pathnameScheme
})

export const createVirtualDomResponseScheme = virtualDomScheme
export type CreateVirtualDomResponseDTO = z.infer<typeof createVirtualDomResponseScheme>
export type CreateVirtualDomDTO = z.infer<typeof createVirtualDomScheme>
