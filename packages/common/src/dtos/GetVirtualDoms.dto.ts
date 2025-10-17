import { paginationScheme, virtualDomScheme } from "@/schemes"
import { z } from "zod"


export const getVirtualDomsResponseScheme = z.object({
    virtualDoms: z.array(virtualDomScheme),
    pagination: z.object({
        next: paginationScheme,
    })
})
export type GetVirtualDomsResponseDto = z.infer<typeof getVirtualDomsResponseScheme>
