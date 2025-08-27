import ErrorHandler from "../utils/errorHandler.utils"
import { Response } from "express"

const errorGlobal = (_: any, res: Response) => {
    new ErrorHandler({
        message: "Error desconocido",
        status_code: 500
    }).response(res)
}

export default errorGlobal