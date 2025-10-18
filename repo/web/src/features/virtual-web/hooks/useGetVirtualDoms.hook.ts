import { getApiResponse, GetVirtualDomsDTO } from "@seo-analyzer/common"
import { useInfiniteQuery } from "@tanstack/react-query"
import { ApiResponse } from "@seo-analyzer/common"

export default function useGetVirtualDoms(virtualWebId: number) {
    return useInfiniteQuery<ApiResponse.Success<GetVirtualDomsDTO["output"]>, ApiResponse.Failed>({
        queryKey: ["virtual-dom", virtualWebId],
        queryFn: async ({ pageParam = 0 }) => {
            const response = await fetch(`/backend/virtual-dom-stored/all/${virtualWebId}?skip=${pageParam}`)
            return getApiResponse(response)
        },
        getNextPageParam: ({ result }) => {
            if (!result) return
            const { pagination } = result
            return pagination.next.has ? pagination.next.skip : undefined
        },
        initialPageParam: 0
    })
}