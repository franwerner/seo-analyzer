import { z } from "zod"
import hostScheme from "../schemes/host.scheme"
import { virtualWebScheme } from "@/schemes"
import { InferDTO } from "@/types/InferDTO.type"

const input = z.object({
    id: z.number(),
    host: hostScheme,
})

const output = virtualWebScheme

export const updateVirtualWebScheme = {
    input,
    output
}
export type UpdateVirtualWebDTO = InferDTO<typeof updateVirtualWebScheme>
