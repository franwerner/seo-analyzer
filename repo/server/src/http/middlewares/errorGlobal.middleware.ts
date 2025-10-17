import { NextFunction, Request, Response } from "express"
import { ZodError } from "zod"
import HTTPError from "../shared/errors/HTTP.error"

const errorGlobal = (err: any, _req: Request, res: Response, _next: NextFunction) => {

    if (err instanceof HTTPError) {
        err.response(res)
    }
    else if (err instanceof ZodError) {
        new HTTPError({
            message: "Error validating schema",
            status_code: 400,
            error_type: "ValidationError"
        }).response(res)
    } else {
        HTTPError.toHTTPError(err).response(res)
    }



}

export default errorGlobal