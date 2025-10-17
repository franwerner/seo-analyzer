import { useMutation } from "@tanstack/react-query"
import getApiResponse from "@/src/common/utils/getApiResponse.util"
import { UpdateVirtualWebDTO } from "@seo-analyzer/common"

export default function useUpdateVirtualWeb() {

    return useMutation({
        mutationFn: async (props: UpdateVirtualWebDTO) => {
            const response = await fetch("/backend/virtual-web/edit", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(props),
            })
            return await getApiResponse(response)
        },
    })
}