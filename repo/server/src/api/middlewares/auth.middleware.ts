import AuthService from "@/infrastructure/auth/auth.service";
import { NextFunction, Request, Response } from "express";

const authMiddleware = (req: Request, _res: Response, next: NextFunction) => {
    AuthService.verifySession(req.cookies?.session)
    next()

}

export default authMiddleware