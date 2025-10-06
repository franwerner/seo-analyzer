import { Router } from "express"
import authMiddleware from "../middlewares/auth.middleware"
import VirtualWebController from "../controllers/virtualWeb.controller"

const virtualWebRouter = Router()

virtualWebRouter.post("/register", authMiddleware, VirtualWebController.registerVirtualWeb)
virtualWebRouter.get("/create-single-analysis", authMiddleware, VirtualWebController.analyzeSinglePage)
virtualWebRouter.get("/analysis", authMiddleware, VirtualWebController.getSinglePageAnalysis)
virtualWebRouter.get("/page", authMiddleware, VirtualWebController.getPage)

export default virtualWebRouter
