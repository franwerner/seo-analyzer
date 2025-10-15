export interface ApiSuccessResponse<T = any> {
    result?: T
    message?: string
}

export interface ApiErrorResponse {
    error_type: string
    message: string
}