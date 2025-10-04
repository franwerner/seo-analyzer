import { NextFunction, Request, Response } from "express";
import errorGlobal from "./errorGlobal.middleware";
import ErrorHandler from "@/shared/utils/errorHandler.utils";
import AuthService from "@/infrastructure/auth/auth.service";

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