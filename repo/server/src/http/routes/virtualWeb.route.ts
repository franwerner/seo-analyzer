import { Router } from "express"
import authMiddleware from "../middlewares/auth.middleware"
import VirtualWebController from "../controllers/virtualWeb.controller"

const virtualWebRouter = Router()

virtualWebRouter.get("/:id/details/", authMiddleware, VirtualWebController.getVirtualWebDetails)
virtualWebRouter.post("/:id/create-summary/", authMiddleware, VirtualWebController.createVirtualWebSummary)
virtualWebRouter.get("/all", authMiddleware, VirtualWebController.getVirtualWebs)
virtualWebRouter.put("/update", authMiddleware, VirtualWebController.updateVirtualWeb)
virtualWebRouter.post("/create", authMiddleware, VirtualWebController.createVirtualWeb)

export default virtualWebRouter
