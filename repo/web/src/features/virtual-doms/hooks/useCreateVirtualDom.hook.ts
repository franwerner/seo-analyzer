import { CreateVirtualDomDTO, CreateVirtualDomResponseDTO, getApiResponse, GetVirtualDomsResponseDto } from "@seo-analyzer/common";
import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiResponse } from "@seo-analyzer/common"

export default function useCreateVirtualDom() {

    const queryClient = useQueryClient()
    return useMutation<ApiResponse.Success<CreateVirtualDomResponseDTO>, ApiResponse.Failed, CreateVirtualDomDTO>({
        mutationKey: ["virtual-dom"],
        mutationFn: async (props) => {
            console.log(props)
            const res = await fetch("/backend/virtual-dom-stored/create", {
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
                (oldData: InfiniteData<ApiResponse.Success<GetVirtualDomsResponseDto>>) => {
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
