import { useMutation } from "@tanstack/react-query"
import getApiResponse from "@/src/common/utils/getApiResponse.util"

export default function useUpdateVirtualWeb() {

    return useMutation({
        mutationFn: async (props: { id: number, host: string, mainPathname: string }) => {
            const response = await fetch("/api/virtual-web/edit", {
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