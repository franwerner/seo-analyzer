import { z } from "zod"
import { validationTypeEnumScheme } from "./validationsType.scheme"


export const analysisIssueScheme = z.object({
    id: z.number(),
    virtualDomAnalysisId: z.number(),
    tag: z.string(),
    message: z.string(),
    traceIdCount: z.number(),
    type: validationTypeEnumScheme,
})

export type AnalysisIssue = z.infer<typeof analysisIssueScheme>