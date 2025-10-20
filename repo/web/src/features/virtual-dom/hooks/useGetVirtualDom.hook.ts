import { getApiResponse, GetVirtualDomDetailsDto } from "@seo-analyzer/common";
import { useQuery } from "@tanstack/react-query";

export default function useGetVirtualDom(virtualDomId: number) {
    return useQuery({
        queryKey: ["virtual-dom", virtualDomId],
        queryFn: async () => {
            const response = await fetch(`/backend/virtual-dom/${virtualDomId}/details`)
            return getApiResponse<GetVirtualDomDetailsDto["output"]>(response)
        }
    })
}