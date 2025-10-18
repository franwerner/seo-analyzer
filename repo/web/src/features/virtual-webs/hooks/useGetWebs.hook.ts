import { getApiResponse, GetVirtualWebsResponseDTO } from "@seo-analyzer/common";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ApiResponse } from "@seo-analyzer/common";


export default function useGetVirtualWebs() {
    return useInfiniteQuery<ApiResponse.Success<GetVirtualWebsResponseDTO>, ApiResponse.Failed>({
        queryKey: ["virtual-webs"],
        queryFn: async ({ pageParam = 0 }) => {
            const response = await fetch(`/backend/virtual-web-stored/all?skip=${pageParam}`)
            return await getApiResponse(response)
        },
        getNextPageParam: ({ result }) => {
            if (!result) return
            const { pagination } = result
            return pagination.next.has ? pagination.next.skip : undefined
        },
        initialPageParam: 0
    })
}