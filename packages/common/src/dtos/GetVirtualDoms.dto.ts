import { paginationScheme, virtualDomScheme } from "@/schemes"
import { InferDTO } from "@/types/InferDTO.type"
import { z } from "zod"


const output = z.object({
    virtualDoms: z.array(virtualDomScheme),
    pagination: z.object({
        next: paginationScheme,
    })
})

const input = null

export const getVirtualDomsScheme = {
    input,
    output
}

export type GetVirtualDomsDTO = InferDTO<typeof getVirtualDomsScheme>
