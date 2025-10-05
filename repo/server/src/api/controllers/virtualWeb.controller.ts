import { virtualWebUseCases } from "@/infrastructure/bootstrap"
import { Request, Response } from "express"

export default class VirtualWebController {

    static async createVirtualWeb(req: Request, res: Response) {
        const host = req.body.host as string
        const pathname = req.body.path as string
        virtualWebUseCases.registerVirtualWeb({ host, mainPathname: pathname, webSummary: null })
        res.status(201).json({ message: "VirtualDom created" })
    }

    static async analyzeSinglePage(req: Request, res: Response) {
        const { host = "", path = "" } = req.params
        const analysis = await virtualWebUseCases.analyzeSinglePage(host, path)

        res.json({
            analysis
        })
    }

    static async getSinglePageAnalysis(req: Request, res: Response) {
        const { host = "", path = "" } = req.params
        const analysis = virtualWebUseCases.getSinglePageAnalysis(host, path)
        res.json({
            analysis
        })
    }

}