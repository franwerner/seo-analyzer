import { ApiErrorResponse, ApiSuccessResponse } from "@/src/common/types/ApiResponse.interface";
import getApiResponse from "@/src/common/utils/getApiResponse.util";
import { useInfiniteQuery } from "@tanstack/react-query";
import { VirtualWeb } from "../types/VirtualWeb.type";


export type SuccessResponseVirtualWebs = { nextSkip: number, hasNext: boolean, virtualWebs: VirtualWeb[] }

export default function useGetVirtualWebs() {
    return useInfiniteQuery<ApiSuccessResponse<SuccessResponseVirtualWebs>, ApiErrorResponse>({
        queryKey: ["webs"],
        queryFn: async ({ pageParam = 0 }) => {
            const response = await fetch(`/api/virtual-web-stored/list?skip=${pageParam}`)
            return await getApiResponse(response)
        },
        getNextPageParam: ({ result }) => {
            if (!result) return
            const { nextSkip, hasNext } = result
            return hasNext ? nextSkip : undefined
        },
        initialPageParam: 0
    })
}