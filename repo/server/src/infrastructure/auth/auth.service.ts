import jwt from "jsonwebtoken"
import crypto from "crypto"
import getEnsureEnv from "@/infrastructure/utils/getEnsureEnv.utils"
import HTTPError from "@/http/shared/errors/HTTP.error"


class AuthService {

    private static compareHash(password: string): void {
        const hashPassword = crypto.createHash("sha256").update(password).digest("hex")
        if (hashPassword !== getEnsureEnv("HASH_PASSWORD")) {
            throw new HTTPError({
                message: "Invalid password",
                status_code: 401,
                error_type: "InvalidPasswordError"
            })
        }
    }

    static login(password: string) {
        this.compareHash(password)
        const token = jwt.sign({}, getEnsureEnv("JWT_SECRET"), { expiresIn: "30d", subject: "admin" })
        return {
            token,
            expires_in: 30 * 24 * 60 * 60 * 1000 //30D
        }
    }

    static verifySession(token: string) {
        try {
            return jwt.verify(token, getEnsureEnv("JWT_SECRET"))
        } catch (error) {
            throw new HTTPError({
                message: "Invalid session",
                status_code: 401,
                error_type: "InvalidSessionError"
            })
        }
    }
}


export default AuthService