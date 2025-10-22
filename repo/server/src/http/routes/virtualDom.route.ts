import { Router } from "express";
import VirtualDomStoredController from "../controllers/virtualDom.controller";

const virtualDomRouter = Router()


virtualDomRouter.post("/create", VirtualDomStoredController.createVirtualDom)
virtualDomRouter.get("/:id/details", VirtualDomStoredController.getVirtualDomDetails)
virtualDomRouter.get("/:id/analyses", VirtualDomStoredController.getVirtualDomAnalyses)
virtualDomRouter.get("/analyses/:analysisId", VirtualDomStoredController.getVirtualDomAnalysis)
export default virtualDomRouter
