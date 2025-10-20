import { getApiResponse, GetVirtualDomsDTO } from "@seo-analyzer/common"
import { useInfiniteQuery } from "@tanstack/react-query"
import { ApiResponse } from "@seo-analyzer/common"

export default function useGetVirtualDoms(virtualWebId: number) {
    return useInfiniteQuery({
        queryKey: ["virtual-doms", virtualWebId],
        queryFn: async ({ pageParam = 0 }) => {
            const response = await fetch(`/backend/virtual-dom/virtual-web/${virtualWebId}?skip=${pageParam}`)
            return getApiResponse<GetVirtualDomsDTO["output"]>(response)
        },
        getNextPageParam: ({ result }) => {
            if (!result) return
            const { pagination } = result
            return pagination.next.has ? pagination.next.skip : undefined
        },
        initialPageParam: 0
    })
}