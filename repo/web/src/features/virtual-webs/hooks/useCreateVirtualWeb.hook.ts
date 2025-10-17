"use client"
import { ApiErrorResponse, ApiSuccessResponse } from "@/src/common/types/ApiResponse.interface"
import getApiResponse from "@/src/common/utils/getApiResponse.util"
import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query"
import { CreateVirtualWebDTO, GetVirtualWebsResponseDTO } from "@seo-analyzer/common";


export default function useCreateVirtualWeb() {
    const queryClient = useQueryClient()

    return useMutation<ApiSuccessResponse<CreateVirtualWebDTO>, ApiErrorResponse, CreateVirtualWebDTO>({
        mutationFn: async (props) => {
            const response = await fetch("/api/virtual-web-stored/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(props),
            })
            return await getApiResponse(response)
        },
        onSuccess: (data) => {
            queryClient.setQueryData(
                ["virtual-webs"],
                (oldData: InfiniteData<ApiSuccessResponse<GetVirtualWebsResponseDTO>>) => {
                    if (!oldData) return oldData
                    const newPages = oldData.pages.map((page, index) =>
                        index === 0
                            ? {
                                ...page,
                                result: {
                                    ...page.result,
                                    virtualWebs: [data.result, ...page.result?.virtualWebs || []]
                                }
                            }
                            : page
                    )
                    return {
                        ...oldData,
                        pages: newPages,

                    }
                }
            )
        },
    })
}