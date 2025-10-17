import { usageScheme, virtualWebSummaryScheme } from "@/schemes";
import { z } from "zod";

export const createVirtualWebSummaryResponseScheme = virtualWebSummaryScheme.extend({
    usage: usageScheme
})

export type CreateVirtualWebSummaryResponseDTO = z.infer<typeof createVirtualWebSummaryResponseScheme>