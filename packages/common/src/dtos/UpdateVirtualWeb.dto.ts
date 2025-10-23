import { z } from "zod"
import { hostScheme } from "../schemes/host.scheme"
import { VirtualWeb } from "@/types/VirtualWeb.interface"

export const updateVirtualWebScheme = z.object({
    id: z.number(),
    host: hostScheme,
})

export type UpdateVirtualWebDTO = {
    input: z.infer<typeof updateVirtualWebScheme>,
    output: VirtualWeb
}
