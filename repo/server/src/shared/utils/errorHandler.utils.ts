import { Response } from "express"

export interface ErrorHandlerProps { message: string, status_code?: number }

class ErrorHandler extends Error {
    message: string
    status_code: number
    constructor({ message, status_code = 500 }: ErrorHandlerProps) {
        super()
        this.message = message
        this.status_code = status_code
    }

    response(res: Response) {
        res.status(this.status_code).json({
            message: this.message,
        })
    }

}

export default ErrorHandler