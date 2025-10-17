import { ApiErrorResponse, ApiSuccessResponse } from "@/src/common/types/ApiResponse.interface";
import getApiResponse from "@/src/common/utils/getApiResponse.util";
import mergeUsage from "@/src/common/utils/mergeUsage.util";
import { CreateVirtualWebSummaryResponseDTO, GetVirtualWebDetailsResponseDTO } from "@seo-analyzer/common";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useCreateVirtualWebSummary(virtualWebId: number) {
    const queryClient = useQueryClient()
    return useMutation<ApiSuccessResponse<CreateVirtualWebSummaryResponseDTO>, ApiErrorResponse>({
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
                (oldData: ApiSuccessResponse<GetVirtualWebDetailsResponseDTO>) => {
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
