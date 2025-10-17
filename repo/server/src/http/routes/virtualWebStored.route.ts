import { Router } from "express"
import authMiddleware from "../middlewares/auth.middleware"
import VirtualWebStoredController from "../controllers/virtualWebStored.controller"

const virtualWebStoredRouter = Router()

virtualWebStoredRouter.get("/all", authMiddleware, VirtualWebStoredController.getVirtualWebs)
virtualWebStoredRouter.get("/details/:id", authMiddleware, VirtualWebStoredController.getVirtualWebDetails)
virtualWebStoredRouter.post("/create", authMiddleware, VirtualWebStoredController.createVirtualWeb)

export default virtualWebStoredRouter
