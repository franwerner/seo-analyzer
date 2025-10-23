import { Usage } from "@/types/Usage.interface"
import { VirtualWeb } from "../types/VirtualWeb.interface"
import { VirtualWebSummary } from "../types/VirtualWebSummary.interface"
import { VirtualWebConfig } from "@/types/VirtualWebConfig.interface"

export interface GetVirtualWebDetailsDTO extends VirtualWeb {
    virtualDomCount: number,
    virtualWebConfig: VirtualWebConfig
    virtualWebSummary: Omit<VirtualWebSummary, 'virtualWebId'>,
    summaryUsage: Usage,
    analysisUsage: Usage
}
