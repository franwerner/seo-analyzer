import getApiResponse from "@/src/common/utils/getApiResponse.util"
import { ApiErrorResponse, ApiSuccessResponse } from "@/src/common/types/ApiResponse.interface"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

export default function useLogin() {
    const router = useRouter()
    return useMutation<ApiSuccessResponse, ApiErrorResponse, string>({
        mutationFn: async (password: string) => {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    password
                }),
            })
            return await getApiResponse(response)
        },
        onSuccess: () => {
            router.push("/admin/")
        }
    })
}