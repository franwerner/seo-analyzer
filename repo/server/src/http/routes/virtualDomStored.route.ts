import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import VirtualDomStoredController from "../controllers/virtualDomStored.controller";

const virtualDomStoredRouter = Router()

virtualDomStoredRouter.get("/all/:virtualWebId", authMiddleware, VirtualDomStoredController.getAllVirtualDoms)
virtualDomStoredRouter.post("/create", authMiddleware, VirtualDomStoredController.createVirtualDom)

export default virtualDomStoredRouter