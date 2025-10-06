import ErrorHandler from "@/shared/utils/errorHandler.utils"
import { NextFunction, Request, Response } from "express"
import { ZodError } from "zod"

const errorGlobal = (err: any, _req: Request, res: Response, _next: NextFunction) => {

    console.log(err)
    if (err instanceof ErrorHandler) {
        return err.response(res)
    }
    else if (err instanceof ZodError) {
        return new ErrorHandler({
            message: "Error validating schema",
            status_code: 400
        }).response(res)
    }
    else {
        return new ErrorHandler({
            message: `Unknown error occurred - ${err}`,
            status_code: 500
        }).response(res)
    }


}

export default errorGlobal