import { virtualDomAnalysisScheme } from "@/schemes"
import { InferDTO } from "@/types/InferDTO.type"

const input = null

const output = virtualDomAnalysisScheme

export const getVirtualDomAnalysisScheme = {
    input,
    output
}

export type GetVirtualDomAnalysisDTO = InferDTO<typeof getVirtualDomAnalysisScheme>
