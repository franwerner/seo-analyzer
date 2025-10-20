import { virtualDomAnalysisScheme } from "@/schemes"
import { analysisIssueScheme } from "@/schemes/analysisIssue.scheme"
import { InferDTO } from "@/types/InferDTO.type"
import { z } from "zod"

const input = null

const output = virtualDomAnalysisScheme.extend({
    analysisIssues: z.array(analysisIssueScheme)
})

export const getVirtualDomAnalysisScheme = {
    input,
    output
}

export type GetVirtualDomAnalysisDTO = InferDTO<typeof getVirtualDomAnalysisScheme>
