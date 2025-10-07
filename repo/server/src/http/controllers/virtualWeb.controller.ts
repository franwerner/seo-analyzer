import { virtualWebUseCases } from "@/infrastructure/bootstrap"
import { Request, Response } from "express"

export default class VirtualWebController {

    static async registerVirtualWeb(req: Request, res: Response) {
        const host = req.body.host as string
        const pathname = req.body.path as string
        await virtualWebUseCases.registerVirtualWeb({
            host,
            pathname,
        })
        res.status(201).json({ message: "VirtualDom created" })
    }

    static async createAnalyzeSinglePage(req: Request, res: Response) {
        const { path = "", host = "", validationsSelected = {} } = req.body as any
        const analysis = await virtualWebUseCases.createAnalyzeSinglePage({ path, host, validationsSelected })
        res.json({
            analysis
        })
    }

    static async getSinglePageAnalysis(req: Request, res: Response) {
        const { host = "", path = "" } = req.query as any
        const analysis = virtualWebUseCases.getSinglePageAnalysis(host, path)
        res.json({
            analysis
        })
    }

    static async getPage(req: Request, res: Response) {
        const { host = "", path = "" } = req.query as any
        const page = virtualWebUseCases.getPage(host, path)
        const snapshot = await page.getOrGenerateSnapshot()
        res.json({
            html: snapshot?.vDomContext.schemas,

        })
    }

}