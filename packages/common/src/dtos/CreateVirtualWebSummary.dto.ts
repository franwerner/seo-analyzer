import { usageScheme, virtualWebSummaryScheme } from "@/schemes";
import { z } from "zod";

export const createVirtualWebSummaryResponseDto = virtualWebSummaryScheme.extend({
    usage: usageScheme
})

export type CreateVirtualWebSummaryResponseDTO = z.infer<typeof createVirtualWebSummaryResponseDto>