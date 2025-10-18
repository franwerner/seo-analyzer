"use client"
import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query"
import { CreateVirtualWebDTO, getApiResponse, GetVirtualWebsDTO } from "@seo-analyzer/common";
import { ApiResponse } from "@seo-analyzer/common";


export default function useCreateVirtualWeb() {
    const queryClient = useQueryClient()

    return useMutation<ApiResponse.Success<CreateVirtualWebDTO["output"]>, ApiResponse.Failed, CreateVirtualWebDTO["input"]>({
        mutationFn: async (props) => {
            const response = await fetch("/backend/virtual-web-stored/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(props),
            })
            return getApiResponse(response)
        },
        onSuccess: (data) => {
            queryClient.setQueryData(
                ["virtual-webs"],
                (oldData: InfiniteData<ApiResponse.Success<GetVirtualWebsDTO["output"]>>) => {
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