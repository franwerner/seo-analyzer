import { NextFunction, Request, Response } from "express";
import AuthService from "../services/auth.service";
import ErrorHandler from "../utils/errorHandler.utils";
import errorGlobal from "./errorGlobal.middleware";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        AuthService.verifySession(req.cookies.session)
        next()
    } catch (error) {
        if (error instanceof ErrorHandler) {
            error.response(res)
        } else {
            errorGlobal(req, res)
        }
    }
}

export default authMiddleware