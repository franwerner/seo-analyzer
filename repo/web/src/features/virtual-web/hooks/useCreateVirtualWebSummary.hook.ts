import mergeUsage from "@/src/common/utils/mergeUsage.util";
import { CreateVirtualWebSummaryResponseDTO, getApiResponse, GetVirtualWebDetailsResponseDTO } from "@seo-analyzer/common";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiResponse } from "@seo-analyzer/common";

export default function useCreateVirtualWebSummary(virtualWebId: number) {
    const queryClient = useQueryClient()
    return useMutation<ApiResponse.Success<CreateVirtualWebSummaryResponseDTO>, ApiResponse.Failed>({
        mutationFn: async () => {
            const response = await fetch(`/backend/virtual-web/create-summary/${virtualWebId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
            })
            return await getApiResponse(response)
        },
        onSuccess(data) {
            queryClient.setQueryData(
                ["virtual-web", virtualWebId],
                (oldData: ApiResponse.Success<GetVirtualWebDetailsResponseDTO>) => {
                    const result = data.result
                    if (!result) return oldData
                    const { usage, ...virtualWebSummary } = result
                    if (!oldData) return oldData
                    return {
                        ...oldData,
                        result: {
                            ...oldData.result,
                            virtualWebSummary,
                            summaryUsage: mergeUsage(oldData.result?.summaryUsage, usage)
                        }
                    }
                }
            )
        },
    })
}
