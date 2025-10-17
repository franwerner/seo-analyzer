import { ApiSuccessResponse } from "@/src/common/types/ApiResponse.interface"


export class ErrorResponse extends Error {
    constructor(public error_type: string, public message: string) { super(message) }

}

export default async function getApiResponse<T>(response: Response): Promise<ApiSuccessResponse<T>> {
    const isJson = response.headers.get('Content-Type')?.includes('application/json')

    if (!isJson) {
        throw new ErrorResponse("server_error", "Something went wrong")
    }
    const json = await response.json()
    if (!response.ok) {
        throw new ErrorResponse(json.error_type, json.message)
    }

    return json as ApiSuccessResponse<T>

}