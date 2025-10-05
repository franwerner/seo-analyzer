import { Router } from "express"
import authMiddleware from "../middlewares/auth.middleware"
import VirtualWebController from "../controllers/virtualWeb.controller"

const virtualWebRouter = Router()

virtualWebRouter.post("/register", authMiddleware, VirtualWebController.createVirtualWeb)
virtualWebRouter.get("/:host/:path/create-single-analysis", authMiddleware, VirtualWebController.analyzeSinglePage)
virtualWebRouter.get("/:host/:path/analysis", authMiddleware, VirtualWebController.getSinglePageAnalysis)

export default virtualWebRouter
