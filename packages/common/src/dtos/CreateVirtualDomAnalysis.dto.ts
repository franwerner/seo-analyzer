import { validationsTypeScheme } from "@/schemes/validationsType.scheme"
import { z } from "zod"
import { GetVirtualDomAnalysisDTO } from "./GetVirtualDomAnalysis.dto"
import { hostScheme, pathnameScheme } from "@/schemes"


export const createVirtualDomAnalysisScheme = z.object({
    host: hostScheme,
    pathname: pathnameScheme,
    validationsSelected: validationsTypeScheme.strip(),
    htmlString: z.string(),
    snapshotId: z.string()
})

export type CreateVirtualDomAnalysisDTO = {
    input: z.infer<typeof createVirtualDomAnalysisScheme>,
    output: GetVirtualDomAnalysisDTO
}