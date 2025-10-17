import { ApiErrorResponse, ApiSuccessResponse } from "@/src/common/types/ApiResponse.interface"
import getApiResponse from "@/src/common/utils/getApiResponse.util"
import { GetVirtualDomsResponseDto } from "@seo-analyzer/common"
import { useInfiniteQuery } from "@tanstack/react-query"

export default function useGetVirtualDoms(virtualWebId: number) {
    return useInfiniteQuery<ApiSuccessResponse<GetVirtualDomsResponseDto>, ApiErrorResponse>({
        queryKey: ["virtual-dom", virtualWebId],
        queryFn: async ({ pageParam = 0 }) => {
            const response = await fetch(`/backend/virtual-dom-stored/all/${virtualWebId}?skip=${pageParam}`)
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