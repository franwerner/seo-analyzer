import { PrismaClient, VirtualDom } from "@prisma/client"


export default class VirtualDomRepository {

    constructor(private client: PrismaClient) { }

    create(data: Omit<VirtualDom, "id" | "createdAt">) {
        return this.client.virtualDom.create({ data, select: { id: true, pathname: true } })
    }

    findByVirtualWebAndDom({ virtualDomId, virtualWebId }: { virtualDomId: number, virtualWebId: number }) {
        return this.client.virtualDom.findUnique({
            where: {
                id: virtualDomId,
                virtualWebId: virtualWebId
            },
            select: {
                id: true,
                pathname: true,
            }
        })
    }


}