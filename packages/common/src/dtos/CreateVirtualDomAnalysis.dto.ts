import { virtualDomAnalysisScheme } from "@/schemes"
import { validationsTypeScheme } from "@/schemes/validationsType.scheme"
import { InferDTO } from "@/types/InferDTO.type"
import { z } from "zod"


const input = z.object({
    id: z.number(),
    virtualWebId: z.number(),
    validationsSelected: validationsTypeScheme.strip()
})

const output = virtualDomAnalysisScheme

export const createVirtualDomAnalysisScheme = {
    input,
    output
}

export type CreateVirtualDomAnalysisDTO = InferDTO<typeof createVirtualDomAnalysisScheme>