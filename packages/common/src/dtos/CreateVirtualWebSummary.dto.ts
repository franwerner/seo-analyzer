import { usageScheme, virtualWebSummaryScheme } from "@/schemes";
import { InferDTO } from "@/types/InferDTO.type";

const output = virtualWebSummaryScheme.extend({
    summaryUsage: usageScheme
})

const input = null

export const createVirtualWebSummaryScheme = {
    input,
    output
}

export type CreateVirtualWebSummaryDTO = InferDTO<typeof createVirtualWebSummaryScheme>