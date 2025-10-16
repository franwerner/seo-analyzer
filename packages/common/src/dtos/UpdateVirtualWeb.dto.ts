import { z } from "zod"
import hostScheme from "./schemes/host.scheme"

export const updateVirtualWebScheme = z.object({
    id: z.number(),
    host: hostScheme,
})

export type UpdateVirtualWebDTO = z.infer<typeof updateVirtualWebScheme>
