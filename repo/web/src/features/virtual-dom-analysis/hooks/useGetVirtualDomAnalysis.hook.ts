import { getApiResponse, GetVirtualDomAnalysisDTO } from "@seo-analyzer/common";
import { useQuery } from "@tanstack/react-query";

export default function useGetVirtualDomAnalysis(virtualDomAnalysisId: number) {

    return useQuery({
        queryKey: ['virtual-dom-analysis', virtualDomAnalysisId],
        queryFn: async () => {
            const response = await fetch(`/backend/virtual-dom/analyses/${virtualDomAnalysisId}`)
            return getApiResponse<GetVirtualDomAnalysisDTO["output"]>(response)
        }
    })
}