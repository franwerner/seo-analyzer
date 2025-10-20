import { CreateVirtualDomDTO, getApiResponse } from "@seo-analyzer/common";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

export default function useCreateVirtualDom() {
    const router = useRouter()
    return useMutation({
        mutationFn: async (props: CreateVirtualDomDTO["input"]) => {
            console.log(props)
            const res = await fetch("/backend/virtual-dom/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(props)
            })
            return getApiResponse<CreateVirtualDomDTO["output"]>(res)
        },
        onSuccess: (data) => {
            router.push(`virtualDom/${data.result.id}`)
        }
    })
}
