import { virtualWebManagerUseCase, virtualWebStoredUseCase } from "@/infrastructure/bootstrap"
import { Request, Response } from "express"

export default class VirtualWebController {


    static async createVirtualWebSummary(req: Request, res: Response) {
        const { id } = req.params
        const result = await virtualWebManagerUseCase.createVirtualWebSummary({
            virtualWebId: Number(id),
        })
        res.status(201).json({
            result
        })
    }

    static async updateVirtualWeb(req: Request, res: Response) {
        const { id, host } = req.body
        const result = await virtualWebManagerUseCase.updateVirtualWeb({
            id,
            host,
        })
        res.status(200).json({
            result
        })
    }

    static async getVirtualWebs(req: Request, res: Response) {
        const { skip } = req.query
        const skipNumber = Number(skip)
        const virtualWeb = await virtualWebStoredUseCase.getVirtualWebs(skipNumber)

        return res.status(200).json({ result: virtualWeb })
    }

    static async createVirtualWeb(req: Request, res: Response) {
        const { host, mainPathname } = req.body
        const result = await virtualWebStoredUseCase.createVirtualWeb({
            host,
            mainPathname: mainPathname
        })
        res.status(201).json({
            result
        })
    }

    static async getVirtualWebDetails(req: Request, res: Response) {
        const { id } = req.params
        const virtualWeb = await virtualWebStoredUseCase.getVirtualWebDetails(Number(id))
        return res.status(200).json({ result: virtualWeb })
    }


}