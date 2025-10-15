import AuthService from "@/infrastructure/auth/auth.service"
import getEnsureEnv from "@/infrastructure/utils/getEnsureEnv.utils"
import { Request, Response } from "express"

export default class AuthController {

    static async login(req: Request, res: Response) {

        const { password } = req.body
        const {
            token,
            expires_in
        } = AuthService.login(password)

        const NODE_ENV = getEnsureEnv("NODE_ENV")

        res.cookie("session", token, {
            httpOnly: true,
            secure: NODE_ENV === "production",
            sameSite: NODE_ENV === "production" ? "none" : "strict",
            maxAge: expires_in
        })
        res.json({ message: "Login successful" })
    }

    static async ping(_req: Request, res: Response) {
        res.json({ message: "session valid" })
    }
}