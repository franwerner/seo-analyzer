import { virtualPageManagerUseCase, virtualWebManagerUseCase } from "@/infrastructure/bootstrap"
import { Request, Response } from "express"

export default class VirtualWebController {

    static async registerVirtualWeb(req: Request, res: Response) {
        const { host, mainPathname } = req.body
        await virtualWebManagerUseCase.registerVirtualWeb({
            host,
            mainPathname: mainPathname
        })
        res.status(201).json({ message: "VirtualDom created" })
    }

    static async createAnalyzeSinglePage(req: Request, res: Response) {
        const { virtualWebId, virtualDomId, validationsSelected = {} } = req.body
        const analysis = await virtualPageManagerUseCase.createSinglePageAnalyze({ virtualWebId, virtualDomId, validationsSelected })
        res.json({
            analysis: analysis
        })
    }

    static async getSinglePageAnalysis(req: Request, res: Response) {
        const { host = "", pathname = "" } = req.query
        res.json({
            analysis: {}
        })
    }

    static async getPage(req: Request, res: Response) {
        // const { host = "", pathname = "" } = req.query as any
        // const page = virtualWebUseCases.getPage(host, pathname)
        // const snapshot = await page.getOrGenerateSnapshot()
        // res.json({
        //     html: snapshot?.vDomContext.schemas,

        // })
    }

}