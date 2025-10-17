import { Router } from "express"
import authMiddleware from "../middlewares/auth.middleware"
import VirtualWebController from "../controllers/virtualWeb.controller"

const virtualWebRouter = Router()

virtualWebRouter.post("/create-summary/:virtualWebId", authMiddleware, VirtualWebController.createVirtualWebSummary)
virtualWebRouter.put("/update", authMiddleware, VirtualWebController.updateVirtualWeb)

export default virtualWebRouter
