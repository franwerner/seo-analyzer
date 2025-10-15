"use client"
import { ApiErrorResponse, ApiSuccessResponse } from "@/src/common/types/ApiResponse.interface"
import getApiResponse from "@/src/common/utils/getApiResponse.util"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { VirtualWeb } from "../types/VirtualWeb.type";

interface RegisterVirtualWebProps {
    host: string;
    mainPathname: string;
}

export default function useRegisterVirtualWeb() {
    const queryClient = useQueryClient()

    return useMutation<ApiSuccessResponse, ApiErrorResponse, RegisterVirtualWebProps>({
        mutationFn: async (props: RegisterVirtualWebProps) => {
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
            queryClient.setQueryData(["webs"], (oldData: ApiSuccessResponse<VirtualWeb[]>) => {
                return {
                    ...oldData,
                    result: [data.result, ...oldData.result || []]
                }
            })
        }
    })
}