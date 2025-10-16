"use client"
import { ApiErrorResponse, ApiSuccessResponse } from "@/src/common/types/ApiResponse.interface"
import getApiResponse from "@/src/common/utils/getApiResponse.util"
import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query"
import { VirtualWeb } from "../types/VirtualWeb.type";
import { CreateVirtualWebDTO } from "@packages/common";
import { SuccessResponseVirtualWebs } from "./useGetWebs.hook";


export default function useRegisterVirtualWeb() {
    const queryClient = useQueryClient()

    return useMutation<ApiSuccessResponse<VirtualWeb>, ApiErrorResponse, CreateVirtualWebDTO>({
        mutationFn: async (props) => {
            const response = await fetch("/api/virtual-web/register", {
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
                ["webs"],
                (oldData: InfiniteData<ApiSuccessResponse<SuccessResponseVirtualWebs>>) => {
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