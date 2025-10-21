import { Express } from "express"
import AuthRouter from "./auth.route"
import virtualWebRouter from "./virtualWeb.route"
import virtualDomRouter from "./virtualDom.route"
import authMiddleware from "../middlewares/auth.middleware"

export default function AppRoutes(app: Express) {
    app.use("/auth", AuthRouter)
    app.use("/virtual-web", authMiddleware, virtualWebRouter)
    app.use("/virtual-dom", authMiddleware, virtualDomRouter)
}
