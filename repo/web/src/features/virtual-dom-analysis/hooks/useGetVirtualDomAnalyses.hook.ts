import { getApiResponse, GetVirtualDomAnalysesDTO } from "@seo-analyzer/common";
import { useInfiniteQuery } from "@tanstack/react-query";

export default function useGetVirtualDomAnalyses(virtualDomId: number) {
    return useInfiniteQuery({
        queryKey: ["virtual-dom-analyses", virtualDomId],
        queryFn: async ({ pageParam = 0 }) => {
            const response = await fetch(`/backend/virtual-dom/${virtualDomId}/analyses?skip=${pageParam}`)
            return getApiResponse<GetVirtualDomAnalysesDTO>(response)
        },
        getNextPageParam: (lastPage) => {
            const result = lastPage.result
            if (!result) return undefined
            const { pagination } = result
            return pagination.next.has ? pagination.next.skip : undefined
        },
        initialPageParam: 0
    })
}