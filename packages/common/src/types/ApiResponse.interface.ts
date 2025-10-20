export declare namespace ApiResponse {

    export interface Success<T = any> {
        result: T
        message?: string
    }

    export interface Failed {
        error_type: string
        message: string
    }

}
