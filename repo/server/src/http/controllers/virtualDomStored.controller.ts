import { virtualDomStoredUseCase } from "@/infrastructure/bootstrap"
import { Request, Response } from "express"

export default class VirtualDomStoredController {

    static async getAllVirtualDoms(req: Request, res: Response) {
        const { virtualWebId } = req.params
        const { skip } = req.query
        const result = await virtualDomStoredUseCase.getVirtualDoms({ virtualWebId: Number(virtualWebId), skip: Number(skip) })
        res.status(200).json({
            result
        })
    }

    static async createVirtualDom(req: Request, res: Response) {
        const { virtualWebId, pathname } = req.body
        const result = await virtualDomStoredUseCase.createVirtualDom({ virtualWebId, pathname })
        res.status(201).json({
            result
        })
    }

}   