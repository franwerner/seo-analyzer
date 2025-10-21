import { Router } from "express";
import VirtualDomStoredController from "../controllers/virtualDom.controller";

const virtualDomRouter = Router()

virtualDomRouter.get("/virtual-web/:virtualWebId", VirtualDomStoredController.getAllVirtualDoms)
virtualDomRouter.post("/create", VirtualDomStoredController.createVirtualDom)
virtualDomRouter.get("/:id/details", VirtualDomStoredController.getVirtualDomDetails)
virtualDomRouter.get("/:id/analyses", VirtualDomStoredController.getVirtualDomAnalyses)
virtualDomRouter.post("/:id/virtual-web/:virtualWebId/analyses", VirtualDomStoredController.createVirtualDomAnalysis)
virtualDomRouter.get("/analyses/:analysisId", VirtualDomStoredController.getVirtualDomAnalysis)
export default virtualDomRouter
