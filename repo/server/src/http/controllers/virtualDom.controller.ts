import { virtualDomStoredUseCase, virtualDomManagerUseCase } from "@/infrastructure/bootstrap"
import { Request, Response } from "express"

export default class VirtualDomController {

    static async getAllVirtualDoms(req: Request, res: Response) {
        const { virtualWebId } = req.params
        const { skip } = req.query
        const result = await virtualDomStoredUseCase.getVirtualDoms({ virtualWebId: Number(virtualWebId), skip: Number(skip) })
        res.status(200).json({
            result
        })
    }

    static async createVirtualDomAnalysis(req: Request, res: Response) {
        const { id, virtualWebId } = req.params
        const { validationsSelected } = req.body
        const result = await virtualDomManagerUseCase
            .createVirtualDomAnalysis({
                id: Number(id),
                virtualWebId: Number(virtualWebId),
                validationsSelected
            })
        res.status(200).json({
            result
        })
    }

    static async getVirtualDomAnalysis(req: Request, res: Response) {
        const { analysisId } = req.params
        const result = await virtualDomStoredUseCase.getVirtualDomAnalysis(Number(analysisId))
        res.status(200).json({
            result
        })
    }


    static async getVirtualDomDetails(req: Request, res: Response) {
        const { id } = req.params
        const result = await virtualDomStoredUseCase.getVirtualDomDetails(Number(id))
        res.status(200).json({
            result
        })
    }

    static async getVirtualDomAnalyses(req: Request, res: Response) {
        const { id } = req.params
        const result = await virtualDomStoredUseCase.getVirtualDomAnalyses(Number(id))
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