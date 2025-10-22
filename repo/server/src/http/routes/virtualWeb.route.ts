import { Router } from "express"
import VirtualWebController from "../controllers/virtualWeb.controller"
import VirtualDomStoredController from "../controllers/virtualDom.controller";

const virtualWebRouter = Router()

virtualWebRouter.get("/:virtualWebId/virtual-doms", VirtualDomStoredController.getVirtualDomsByVirtualWeb)
virtualWebRouter.post("/:virtualWebId/virtual-dom/:virtualDomId/analyses", VirtualDomStoredController.createVirtualDomAnalysis)
virtualWebRouter.get("/:id/details/", VirtualWebController.getVirtualWebDetails)
virtualWebRouter.post("/:id/create-summary/", VirtualWebController.createVirtualWebSummary)
virtualWebRouter.get("/all", VirtualWebController.getVirtualWebs)
virtualWebRouter.put("/update", VirtualWebController.updateVirtualWeb)
virtualWebRouter.post("/create", VirtualWebController.createVirtualWeb)

export default virtualWebRouter
