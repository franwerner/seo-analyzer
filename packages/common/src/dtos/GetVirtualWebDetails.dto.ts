import { z } from "zod"
import { usageScheme } from "../schemes/usage.scheme"
import { virtualWebScheme } from "../schemes/virtualWeb.scheme"
import { virtualWebSummaryScheme } from "../schemes/virtualWebSummary.scheme"
import { InferDTO } from "@/types/InferDTO.type"

const output = virtualWebScheme.merge(z.object({
    virtualWebSummary: virtualWebSummaryScheme.nullable().optional(),
    summaryUsage: usageScheme,
    analysisUsage: usageScheme,
}))

const input = null

export const getVirtualWebDetailsScheme = {
    input,
    output
}

export type GetVirtualWebDetailsDTO = InferDTO<typeof getVirtualWebDetailsScheme>
