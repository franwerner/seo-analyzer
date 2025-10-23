import { Usage } from "@/types/Usage.interface";
import { VirtualWebSummary } from "@/types/VirtualWebSummary.interface";


export type CreateVirtualWebSummaryDTO = {
    input: null,
    output: {
        virtualWebSummary: VirtualWebSummary,
        summaryUsage: Usage
    }
}