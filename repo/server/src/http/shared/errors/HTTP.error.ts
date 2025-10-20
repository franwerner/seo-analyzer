import { CustomError, CustomErrorProps } from "@/global-shared/errors/Custom.error"
import { Response } from "express"
import HTTPErrorMap from "../constant/HTTPErrorMap.constant"

export interface HTTPErrorProps extends Omit<CustomErrorProps, 'name' | 'type'> {
    status_code?: number
    error_type?: string
}

export default class HTTPError extends CustomError {
    status_code: number
    error_type: string
    constructor({ status_code = 500, error_type = "HTTPError", ...props }: HTTPErrorProps) {
        super({
            ...props,
            name: "HTTPError",
        })
        this.status_code = status_code
        this.error_type = error_type
    }

    response(res: Response) {
        res.status(this.status_code).json({
            message: this.message,
            error_type: this.error_type
        })
    }

    static toHTTPError(error: CustomError) {
        console.log(`Error: ${error.name} - ${error.message}`)
        console.log(error)
        if (HTTPErrorMap[error.name]) {
            return new HTTPError({
                status_code: HTTPErrorMap[error.name],
                error_type: error.name,
                message: error.message,
            })
        } else {
            return new HTTPError({
                message: `Unknown error occurred - ${error}`,
                status_code: 500,
                error_type: "UnknownError"
            })
        }

    }
}


