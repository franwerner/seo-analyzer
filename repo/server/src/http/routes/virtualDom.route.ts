import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import VirtualDomStoredController from "../controllers/virtualDom.controller";

const virtualDomRouter = Router()

virtualDomRouter.get("/virtual-web/:virtualWebId", authMiddleware, VirtualDomStoredController.getAllVirtualDoms)
virtualDomRouter.post("/create", authMiddleware, VirtualDomStoredController.createVirtualDom)
virtualDomRouter.get("/:id/details", authMiddleware, VirtualDomStoredController.getVirtualDomDetails)
virtualDomRouter.get("/:id/analyses", authMiddleware, VirtualDomStoredController.getVirtualDomAnalyses)
virtualDomRouter.post("/:id/virtual-web/:virtualWebId/analyses", authMiddleware, VirtualDomStoredController.createVirtualDomAnalysis)
virtualDomRouter.get("/analyses/:analysisId", authMiddleware, VirtualDomStoredController.getVirtualDomAnalysis)
export default virtualDomRouter
