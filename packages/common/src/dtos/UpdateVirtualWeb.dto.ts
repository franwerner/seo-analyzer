import { z } from "zod"
import hostScheme from "../schemes/host.scheme"
import { virtualWebScheme } from "@/schemes"

export const updateVirtualWebScheme = z.object({
    id: z.number(),
    host: hostScheme,
})

export type UpdateVirtualWebDTO = z.infer<typeof updateVirtualWebScheme>

export const updateVirtualWebResponseScheme = virtualWebScheme
export type UpdateVirtualWebResponseScheme = z.infer<typeof updateVirtualWebResponseScheme>
