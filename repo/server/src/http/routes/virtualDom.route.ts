import { Router } from "express";
import VirtualDomStoredController from "../controllers/virtualDom.controller";

const virtualDomRouter = Router()


virtualDomRouter.post("/create", VirtualDomStoredController.createVirtualDom)
virtualDomRouter.post("/analyze", VirtualDomStoredController.createVirtualDomAnalysis)
virtualDomRouter.get("/:id/details", VirtualDomStoredController.getVirtualDomDetails)
virtualDomRouter.get("/by-host-path", VirtualDomStoredController.getVirtualDomByHostPath)
virtualDomRouter.get("/:id/analyses", VirtualDomStoredController.getVirtualDomAnalyses)
virtualDomRouter.get("/analyses/:analysisId", VirtualDomStoredController.getVirtualDomAnalysis)
export default virtualDomRouter
