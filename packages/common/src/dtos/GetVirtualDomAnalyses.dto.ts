import { Pagination } from "@/types/Pagination.interface"
import { GetVirtualDomAnalysisDTO } from "./GetVirtualDomAnalysis.dto"


export type GetVirtualDomAnalysesDTO = {
    virtualDomAnalyses: Array<GetVirtualDomAnalysisDTO>
    pagination: {
        next: Pagination
    }
}