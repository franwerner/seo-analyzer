import { z } from "zod"
import { virtualWebScheme } from "../schemes/virtualWeb.scheme"
import { paginationScheme } from "@/schemes"
import { InferDTO } from "@/types/InferDTO.type"

const output = z.object({
    virtualWebs: z.array(virtualWebScheme),
    pagination: z.object({
        next: paginationScheme
    })
})

const input = null

export const getVirtualWebsScheme = {
    input,
    output
}

export type GetVirtualWebsDTO = InferDTO<typeof getVirtualWebsScheme>
