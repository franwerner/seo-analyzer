import { validationsTypeScheme } from "@/schemes/validationsType.scheme"
import { z } from "zod"
import { GetVirtualDomAnalysisDTO } from "./GetVirtualDomAnalysis.dto"


export const createVirtualDomAnalysisScheme = z.object({
    id: z.number(),
    virtualWebId: z.number(),
    validationsSelected: validationsTypeScheme.strip()
})

export type CreateVirtualDomAnalysisDTO = {
    input: z.infer<typeof createVirtualDomAnalysisScheme>,
    output: GetVirtualDomAnalysisDTO
}