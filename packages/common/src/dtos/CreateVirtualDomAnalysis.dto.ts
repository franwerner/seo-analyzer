import { validationsTypeScheme } from "@/schemes/validationsType.scheme"
import { z } from "zod"
import { GetVirtualDomAnalysisDTO } from "./GetVirtualDomAnalysis.dto"


export const createVirtualDomAnalysisScheme = z.object({
    host: z.string(),
    pathname: z.string(),
    validationsSelected: validationsTypeScheme.strip(),
    htmlString: z.string(),
    snapshotId: z.string()
})

export type CreateVirtualDomAnalysisDTO = {
    input: z.infer<typeof createVirtualDomAnalysisScheme>,
    output: GetVirtualDomAnalysisDTO
}