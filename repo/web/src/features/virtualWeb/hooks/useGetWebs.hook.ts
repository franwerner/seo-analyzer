import getApiResponse from "@/src/common/utils/getApiResponse.util";
import { useQuery } from "@tanstack/react-query";
import { VirtualWeb } from "../types/VirtualWeb.type";
import { ApiErrorResponse, ApiSuccessResponse } from "@/src/common/types/ApiResponse.interface";

export default function useGetVirtualWebs() {
    return useQuery<ApiSuccessResponse<VirtualWeb[]>, ApiErrorResponse>({
        queryKey: ["webs"],
        queryFn: async () => {
            const response = await fetch("/api/virtual-web-stored/list")
            return getApiResponse(response)
        }
    })
}