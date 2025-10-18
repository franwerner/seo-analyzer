import { ApiResponse, getApiResponse, GetVirtualWebsDTO } from "@seo-analyzer/common";
import { useInfiniteQuery } from "@tanstack/react-query";


export default function useGetVirtualWebs() {
    return useInfiniteQuery<ApiResponse.Success<GetVirtualWebsDTO["output"]>, ApiResponse.Failed>({
        queryKey: ["virtual-webs"],
        queryFn: async ({ pageParam = 0 }) => {
            const response = await fetch(`/backend/virtual-web-stored/all?skip=${pageParam}`)
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