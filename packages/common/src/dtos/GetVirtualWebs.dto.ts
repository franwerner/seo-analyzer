import { z } from "zod"
import { virtualWebScheme } from "../schemes/virtualWeb.scheme"
import { paginationScheme } from "@/schemes"

export const getVirtualWebsResponseScheme = z.object({
    virtualWebs: z.array(virtualWebScheme),
    pagination: z.object({
        next: paginationScheme
    })
})

export type GetVirtualWebsResponseDTO = z.infer<typeof getVirtualWebsResponseScheme>
