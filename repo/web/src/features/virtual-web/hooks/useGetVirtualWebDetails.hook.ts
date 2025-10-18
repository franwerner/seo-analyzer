import { getApiResponse, GetVirtualWebDetailsResponseDTO } from "@seo-analyzer/common";
import { useQuery } from "@tanstack/react-query";
import { ApiResponse } from "@seo-analyzer/common";

export default function useGetVirtualWebDetails(virtualWebId: number) {
    return useQuery<ApiResponse.Success<GetVirtualWebDetailsResponseDTO>, ApiResponse.Failed>({
        queryFn: async () => {
            const response = await fetch(`/backend/virtual-web-stored/details/${virtualWebId}`)
            return await getApiResponse(response)
        },
        queryKey: ["virtual-web", virtualWebId]
    })

}