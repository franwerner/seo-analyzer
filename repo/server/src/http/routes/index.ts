import { Express } from "express"
import AuthRouter from "./auth.route"
import virtualWebRouter from "./virtualWeb.route"
import virtualWebStoredRouter from "./virtualWebStored.route"
import virtualDomStoredRouter from "./virtualDomStored.route"

export default function AppRoutes(app: Express) {
    app.use("/auth", AuthRouter)
    app.use("/virtual-web", virtualWebRouter)
    app.use("/virtual-web-stored", virtualWebStoredRouter)
    app.use("/virtual-dom-stored", virtualDomStoredRouter)
}
