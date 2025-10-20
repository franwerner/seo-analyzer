import { Express } from "express"
import AuthRouter from "./auth.route"
import virtualWebRouter from "./virtualWeb.route"
import virtualDomRouter from "./virtualDom.route"

export default function AppRoutes(app: Express) {
    app.use("/auth", AuthRouter)
    app.use("/virtual-web", virtualWebRouter)
    app.use("/virtual-dom", virtualDomRouter)
}
