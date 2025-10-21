import { PrismaClient, VirtualDom } from "@prisma/client"

const LIMIT = 15

export default class VirtualDomRepository {

    constructor(private client: PrismaClient) { }

    create(data: Omit<VirtualDom, "id" | "createdAt">) {
        return this.client.virtualDom.create({ data, select: { id: true, pathname: true, createdAt: true, virtualWebId: true } })
    }

    async findByVirtualWeb({ virtualWebId, skip }: { virtualWebId: number, skip: number }) {
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
            skip,
            take: LIMIT,
            orderBy: {
                id: 'desc'
            },
        })

        const hasNextPromise = this.client.virtualDom.count({
            where: {
                virtualWebId
            },
            skip: (skip + LIMIT),
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

    findByRelation({ id, virtualWebId }: { id: number, virtualWebId: number }) {
        return this.client.virtualDom.findUnique({
            where: {
                id,
                virtualWebId
            },
            select: {
                id: true,
                pathname: true,
            }
        })
    }

    findUniqueWithVirtualWeb({ id }: { id: number }) {
        return this.client.virtualDom.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                pathname: true,
                createdAt: true,
                virtualWeb: {
                    select: {
                        host: true,
                        id: true
                    }
                },
            },
        })
    }

    async findAnalysisUsage({ id }: { id: number }) {
        const res = await this.client.aIUsage.aggregate({
            where: {
                virtualDomAnalysisUsage: {
                    virtualDomAnalysis: {
                        virtualDom: {
                            id
                        }
                    }
                }
            },
            _sum: {
                input: true,
                output: true
            }
        })
        const input = Number(res._sum.input) || 0
        const output = Number(res._sum.output) || 0
        return {
            input,
            output,
        }
    }


}