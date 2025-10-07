import { Response } from "express"
import { CustomError, CustomErrorProps } from "./Custom.error"
import HTTPErrorMap from "../constant/HTTPErrorMap.constant"

export interface HTTPErrorProps extends Omit<CustomErrorProps, 'name' | 'type'> {
    status_code?: number
    type?: string
}

export default class HTTPError extends CustomError {
    status_code: number
    type: string
    constructor({ status_code = 500, type = "HTTPError", ...props }: HTTPErrorProps) {
        super({
            ...props,
            name: "HTTPError",
        })
        this.status_code = status_code
        this.type = type
    }

    response(res: Response) {
        res.status(this.status_code).json({
            message: this.message,
            type: this.type
        })
    }

    static toHTTPError(error: CustomError) {
        console.log(`Error: ${error.name} - ${error.message}`)
        if (HTTPErrorMap[error.name]) {
            return new HTTPError({
                status_code: HTTPErrorMap[error.name],
                type: error.name,
                message: error.message,
            })
        } else {
            return new HTTPError({
                message: `Unknown error occurred - ${error}`,
                status_code: 500,
                type: "UnknownError"
            })
        }

    }
}


