import { NextFunction, Request, RequestHandler, Response } from "express"
import { ZodError } from "zod"

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

    static routeHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<void> | void): RequestHandler {
        return async (req, res, next) => {
            try {
                await fn(req, res, next)
            } catch (error) {
                if (error instanceof ErrorHandler) {
                    error.response(res)
                }
                else if (error instanceof ZodError) {
                    res.status(400).json({
                        message: "Error validating schema",
                    })
                }
                else {
                    next(error)
                }
            }
        }
    }
}

export default ErrorHandler