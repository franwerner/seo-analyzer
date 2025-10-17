import { ApiErrorResponse, ApiSuccessResponse } from "@/src/common/types/ApiResponse.interface";
import getApiResponse from "@/src/common/utils/getApiResponse.util";
import { GetVirtualWebDetailsResponseDTO } from "@packages/common";
import { useQuery } from "@tanstack/react-query";

export default function useGetVirtualWebDetails(virtualWebId: number) {
    return useQuery<ApiSuccessResponse<GetVirtualWebDetailsResponseDTO>, ApiErrorResponse>({
        queryFn: async () => {
            const response = await fetch(`/api/virtual-web-stored/details/${virtualWebId}`)
            return await getApiResponse(response)
        },
        queryKey: ["virtual-web", virtualWebId]
    })

}