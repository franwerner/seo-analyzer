import { PrismaClient, VirtualDom } from "@prisma/client"

const LIMIT = 15

export default class VirtualDomRepository {

    constructor(private client: PrismaClient) { }

    create(data: Omit<VirtualDom, "id" | "createdAt">) {
        return this.client.virtualDom.create({ data, select: { id: true, pathname: true, createdAt: true, virtualWebId: true } })
    }

    async findAllByVirtualWeb({ virtualWebId, skip }: { virtualWebId: number, skip: number }) {
        const virtualDomsPromise = this.client.virtualDom.findMany({
            where: {
                virtualWebId
            },
            select: {
                id: true,
                pathname: true,
                createdAt: true,
                virtualWebId: true
            },
            skip: skip,
            take: LIMIT,
            orderBy: {
                id: 'desc'
            },
        })

        const nextSkip = skip + LIMIT

        const hasNextPromise = this.client.virtualDom.count({
            where: {
                virtualWebId
            },
            skip: nextSkip,
            take: 1,
        })

        const [virtualDoms, hasNext] = await Promise.all([
            virtualDomsPromise,
            hasNextPromise,
        ])


        return {
            virtualDoms,
            pagination: {
                next: {
                    has: hasNext > 0,
                    skip: skip + LIMIT
                }
            }
        }
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