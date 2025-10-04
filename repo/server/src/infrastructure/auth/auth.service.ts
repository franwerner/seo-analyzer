import jwt from "jsonwebtoken"
import crypto from "crypto"
import ErrorHandler from "@/shared/utils/errorHandler.utils"
import getEnsureEnv from "@/shared/utils/getEnsureEnv.utils"


class AuthService {

    private static compareHash(password: string): void {
        const hashPassword = crypto.createHash("sha256").update(password).digest("hex")
        if (hashPassword !== getEnsureEnv("HASH_PASSWORD")) {
            throw new ErrorHandler({
                message: "Invalid password",
                status_code: 401
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
            throw new ErrorHandler({
                message: "Invalid session",
                status_code: 401
            })
        }
    }
}


export default AuthService