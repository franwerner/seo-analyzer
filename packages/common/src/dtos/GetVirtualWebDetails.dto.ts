import { z } from "zod"
import { usageScheme } from "../schemes/usage.scheme"
import { virtualWebScheme } from "../schemes/virtualWeb.scheme"
import { virtualWebSummaryScheme } from "../schemes/virtualWebSummary.scheme"


export const getVirtualWebDetailsResponseScheme = virtualWebScheme.merge(z.object({
    virtualWebSummary: virtualWebSummaryScheme.nullable().optional(),
    summaryUsage: usageScheme,
    analysisUsage: usageScheme,
}))


export type GetVirtualWebDetailsResponseDTO = z.infer<typeof getVirtualWebDetailsResponseScheme>
