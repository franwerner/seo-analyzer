import { virtualWebUseCases } from "@/infrastructure/bootstrap"
import { Request, Response } from "express"

export default class VirtualWebController {

    static async registerVirtualWeb(req: Request, res: Response) {
        const host = req.body.host as string
        const mainPathname = req.body.mainPathname as string
        await virtualWebUseCases.registerVirtualWeb({
            host,
            mainPathname: mainPathname
        })
        res.status(201).json({ message: "VirtualDom created" })
    }

    static async createAnalyzeSinglePage(req: Request, res: Response) {
        const { pathname = "", host = "", validationsSelected = {} } = req.body as any
        const analysis = await virtualWebUseCases.createAnalyzeSinglePage({ pathname, host, validationsSelected })
        res.json({
            analysis
        })
    }

    static async getSinglePageAnalysis(req: Request, res: Response) {
        const { host = "", pathname = "" } = req.query as any
        const analysis = virtualWebUseCases.getSinglePageAnalysis(host, pathname)
        res.json({
            analysis
        })
    }

    static async getPage(req: Request, res: Response) {
        const { host = "", pathname = "" } = req.query as any
        const page = virtualWebUseCases.getPage(host, pathname)
        const snapshot = await page.getOrGenerateSnapshot()
        res.json({
            html: snapshot?.vDomContext.schemas,

        })
    }

}