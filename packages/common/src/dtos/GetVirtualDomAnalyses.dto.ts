import { paginationScheme } from "@/schemes"
import { virtualDomAnalysisScheme } from "@/schemes/VirtualDomAnalysis.scheme"
import { InferDTO } from "@/types/InferDTO.type"
import { z } from "zod"

const input = null

const output = z.object({
    virtualDomAnalyses: z.array(virtualDomAnalysisScheme),
    pagination: z.object({
        next: paginationScheme,
    })
})

export const getVirtualDomAnalysesScheme = {
    input,
    output
}

export type GetVirtualDomAnalysesDTO = InferDTO<typeof getVirtualDomAnalysesScheme>