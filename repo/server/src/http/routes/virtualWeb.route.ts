import { Router } from "express"
import VirtualWebController from "../controllers/virtualWeb.controller"

const virtualWebRouter = Router()

virtualWebRouter.get("/:id/details/", VirtualWebController.getVirtualWebDetails)
virtualWebRouter.post("/:id/create-summary/", VirtualWebController.createVirtualWebSummary)
virtualWebRouter.get("/all", VirtualWebController.getVirtualWebs)
virtualWebRouter.put("/update", VirtualWebController.updateVirtualWeb)
virtualWebRouter.post("/create", VirtualWebController.createVirtualWeb)

export default virtualWebRouter
