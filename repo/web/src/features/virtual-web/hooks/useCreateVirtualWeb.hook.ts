"use client"
import { CreateVirtualWebDTO, getApiResponse } from "@seo-analyzer/common";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";


export default function useCreateVirtualWeb() {
    const router = useRouter()

    return useMutation({
        mutationFn: async (props: CreateVirtualWebDTO["input"]) => {
            const response = await fetch("/backend/virtual-web/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(props),
            })
            return getApiResponse<CreateVirtualWebDTO["output"]>(response)
        },
        onSuccess: (data) => {
            router.push(`/virtualWeb/${data.result.id}`)
        }

    })
}