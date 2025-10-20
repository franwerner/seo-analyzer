import { getApiResponse, GetVirtualWebDetailsDTO } from "@seo-analyzer/common";
import { useQuery } from "@tanstack/react-query";

export default function useGetVirtualWebDetails(virtualWebId: number) {
    return useQuery({
        queryFn: async () => {
            const response = await fetch(`/backend/virtual-web/${virtualWebId}/details`)
            return getApiResponse<GetVirtualWebDetailsDTO["output"]>(response)
        },
        queryKey: ["virtual-web", virtualWebId]
    })

}