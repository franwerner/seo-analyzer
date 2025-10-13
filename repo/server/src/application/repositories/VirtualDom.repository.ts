import { PrismaClient, VirtualDom } from "@prisma/client"


export default class VirtualDomRepository {

    constructor(private client: PrismaClient) { }

    create(data: Omit<VirtualDom, "id" | "createdAt">) {
        return this.client.virtualDom.create({ data, select: { id: true, pathname: true } })
    }

    findUnique(virtualDomId: number) {
        return this.client.virtualDom.findUnique({
            where: {
                id: virtualDomId,
            },
            select: {
                id: true,
                pathname: true,
            }
        })
    }


}