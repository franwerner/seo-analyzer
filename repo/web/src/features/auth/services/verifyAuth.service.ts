"use server"
import { jwtVerify } from "jose"

export default async function verifyAuth(sessionId: string) {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "")
    return await jwtVerify(sessionId, secret)
}