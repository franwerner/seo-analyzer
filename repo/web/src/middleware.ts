import { MiddlewareConfig, NextRequest, NextResponse } from "next/server";
import verifyAuth from "./features/auth/services/verifyAuth.service";
export const config: MiddlewareConfig = {
    matcher: ["/admin/:path*"],

}
export async function middleware(req: NextRequest) {

    try {
        await verifyAuth(req.cookies.get("session")?.value || "")
        return NextResponse.next()
    } catch (error) {
        return NextResponse.redirect(new URL("/login", req.url))
    }
}