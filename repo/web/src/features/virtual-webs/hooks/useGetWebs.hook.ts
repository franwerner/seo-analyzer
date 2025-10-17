import { ApiErrorResponse, ApiSuccessResponse } from "@/src/common/types/ApiResponse.interface";
import getApiResponse from "@/src/common/utils/getApiResponse.util";
import { GetVirtualWebsResponseDTO } from "@seo-analyzer/common";
import { useInfiniteQuery } from "@tanstack/react-query";


export default function useGetVirtualWebs() {
    return useInfiniteQuery<ApiSuccessResponse<GetVirtualWebsResponseDTO>, ApiErrorResponse>({
        queryKey: ["virtual-webs"],
        queryFn: async ({ pageParam = 0 }) => {
            const response = await fetch(`/api/virtual-web-stored/all?skip=${pageParam}`)
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