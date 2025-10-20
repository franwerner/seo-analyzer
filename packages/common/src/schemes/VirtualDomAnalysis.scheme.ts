import z from "zod";
import { dateScheme } from "./date.scheme";
import { usageScheme } from "./usage.scheme";


export const virtualDomAnalysisScheme = z.object({
    id: z.number(),
    virtualDomId: z.number(),
    createdAt: dateScheme,
    issuesCount: z.number(),
    analysisUsage: usageScheme
})


export type VirtualDomAnalysis = z.infer<typeof virtualDomAnalysisScheme>