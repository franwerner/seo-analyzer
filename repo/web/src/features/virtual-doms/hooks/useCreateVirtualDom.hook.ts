import { ApiErrorResponse, ApiSuccessResponse } from "@/src/common/types/ApiResponse.interface";
import getApiResponse from "@/src/common/utils/getApiResponse.util";
import { CreateVirtualDomDTO, CreateVirtualDomResponseDTO, GetVirtualDomsResponseDto } from "@seo-analyzer/common";
import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query";

export default function useCreateVirtualDom() {

    const queryClient = useQueryClient()
    return useMutation<ApiSuccessResponse<CreateVirtualDomResponseDTO>, ApiErrorResponse, CreateVirtualDomDTO>({
        mutationKey: ["virtual-dom"],
        mutationFn: async (props) => {
            console.log(props)
            const res = await fetch("/api/virtual-dom-stored/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(props)
            })
            return getApiResponse(res)
        },
        onSuccess: (data) => {
            queryClient.setQueryData(
                ["virtual-dom", data.result?.virtualWebId],
                (oldData: InfiniteData<ApiSuccessResponse<GetVirtualDomsResponseDto>>) => {
                    if (!oldData) return oldData
                    const newPages = oldData.pages.map((page, index) =>
                        index === 0
                            ? {
                                ...page,
                                result: {
                                    ...page.result,
                                    virtualDoms: [data.result, ...page.result?.virtualDoms || []]
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
        }
    })
}
