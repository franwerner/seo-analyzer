import mergeUsage from "@/src/common/utils/mergeUsage.util";
import { ApiResponse, CreateVirtualWebSummaryDTO, getApiResponse, GetVirtualWebDetailsDTO } from "@seo-analyzer/common";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useCreateVirtualWebSummary(virtualWebId: number) {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async () => {
            const response = await fetch(`/backend/virtual-web/${virtualWebId}/create-summary`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
            })
            return getApiResponse<CreateVirtualWebSummaryDTO["output"]>(response)
        },
        onSuccess(data) {
            queryClient.setQueryData(
                ["virtual-web", virtualWebId],
                (oldData: ApiResponse.Success<GetVirtualWebDetailsDTO["output"]>) => {
                    const result = data.result
                    if (!result) return oldData
                    const { summaryUsage, ...virtualWebSummary } = result
                    if (!oldData) return oldData
                    return {
                        ...oldData,
                        result: {
                            ...oldData.result,
                            virtualWebSummary,
                            summaryUsage: mergeUsage(oldData.result?.summaryUsage, summaryUsage)
                        }
                    }
                }
            )
        },
    })
}