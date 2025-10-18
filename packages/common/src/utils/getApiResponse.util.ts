import { ApiResponse } from "../types"


export class ApiResponseFailed extends Error {
    constructor(public error_type: string, public message: string) { super(message) }

}

export async function getApiResponse<T>(response: Response): Promise<ApiResponse.Success<T>> {
    const isJson = response.headers.get('Content-Type')?.includes('application/json')

    if (!isJson) {
        throw new ApiResponseFailed("server_error", "Something went wrong")
    }
    const json = await response.json()
    if (!response.ok) {
        throw new ApiResponseFailed(json.error_type, json.message)
    }

    return json as ApiResponse.Success<T>

}