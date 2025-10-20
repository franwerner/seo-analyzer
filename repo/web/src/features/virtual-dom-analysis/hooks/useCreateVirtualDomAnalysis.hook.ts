"use client"
import { CreateVirtualDomAnalysisDTO, getApiResponse } from "@seo-analyzer/common";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function useCreateVirtualDomAnalysis() {
    const router = useRouter()
    return useMutation({
        mutationFn: async ({ virtualWebId, id, ...rest }: CreateVirtualDomAnalysisDTO["input"]) => {
            const response = await fetch(`/backend/virtual-dom/${id}/virtual-web/${virtualWebId}/analyses`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ...rest
                })
            })
            return getApiResponse<CreateVirtualDomAnalysisDTO["output"]>(response)
        },
        onSuccess: ({ result }) => {
            router.push(`${result.virtualDomId}/analyses/${result.id}`)
        }

    })
}