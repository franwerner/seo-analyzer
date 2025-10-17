import { PrismaClient } from "@prisma/client";

const LIMIT = 15

/**
 * @edge_case :
 * Cuando se actualice el virtualWebConfig para cambiar el mainVirtualDomID, 
 * se debera verificar que ese mainVirtualDomId este relacionado al virtualWebID antes de actualizar la tabla.
 * Ya que no garantiza una relacion logica entre los 2 campos.
 */

export default class VirtualWebRepository {
    constructor(private client: PrismaClient) { }

    async createVirtualWebAggregate({
        ...data
    }: { host: string, mainPathname: string }) {

        return await this.client.$transaction(async (tx) => {
            const virtualWeb = await tx.virtualWeb.create({
                data: {
                    host: data.host,
                },
                select: {
                    id: true,
                    host: true,
                    createdAt: true
                }
            })


            const virtualDom = await tx.virtualDom.create({
                data: {
                    pathname: data.mainPathname,
                    virtualWebId: virtualWeb.id,
                },
                select: {
                    id: true,
                    pathname: true
                }

            })

            await tx.virtualWebConfig.create({
                data: {
                    virtualWebId: virtualWeb.id,
                    mainVirtualDomId: virtualDom.id,
                },
                select: { id: true } //Prisma no acepta no devolver nada.
            })

            return {
                ...virtualWeb,
                virtualWebConfig: {
                    virtualDom: {
                        id: virtualDom.id,
                        pathname: virtualDom.pathname
                    }
                },
                virtualDomCount: 1 //Siempre se crea uno por lo tanto lo devolvemos
            }

        })
    }

    async findUniqueWithConfigAndSummary(id: number) {

        const res = await this.client.virtualWeb.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                host: true,
                createdAt: true,
                virtualWebConfig: {
                    select: {
                        virtualDom: {
                            select: {
                                id: true,
                                pathname: true
                            }
                        }
                    }
                },
                virtualWebSummary: {
                    take: 1,
                    orderBy: {
                        createdAt: 'desc'
                    },
                    select: {
                        id: true,
                        content: true,
                        createdAt: true,
                    },
                },
                _count: {
                    select: {
                        virtualDom: true
                    }
                },
            }
        })

        if (!res) return null

        const { virtualWebConfig, virtualWebSummary, _count, ...virtualWeb } = res

        return {
            ...virtualWeb,
            virtualWebConfig,
            virtualWebSummary: virtualWebSummary[0],//Siempre se obtiene uno
            virtualDomCount: _count.virtualDom,
        }

    }

    update({ id, host }: { id: number, host: string }) {
        return this.client.virtualWeb.update({
            where: {
                id,
            },
            data: {
                host: host
            },
            select: {
                id: true,
                createdAt: true,
                host: true,
            }
        })
    }

    async findAll(skip: number = 0) {
        const virtualWebsPromise = this.client.virtualWeb.findMany({
            select: {
                id: true,
                host: true,
                createdAt: true,
                virtualWebConfig: {
                    select: {
                        virtualDom: {
                            select: {
                                id: true,
                                pathname: true
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        virtualDom: true
                    }
                },
            },
            orderBy: {
                id: 'desc'
            },
            skip,
            take: LIMIT

        })
        const hasNextPromise = this.client.virtualWeb.count({
            skip: (skip + LIMIT),
            take: 1,
        })

        const [hasNext, virtualWebs] = await Promise.all([
            hasNextPromise,
            virtualWebsPromise
        ])

        return {
            virtualWebs: virtualWebs.map(({ _count, ...virtualWeb }) => {
                return {
                    ...virtualWeb,
                    virtualDomCount: _count.virtualDom
                }
            }),
            pagination: {
                next: {
                    has: hasNext > 0,
                    skip: skip + LIMIT
                }
            }
        }
    }

    async sumSummaryUsage(id: number) {
        const res = await this.client.aIUsage.aggregate({
            where: {
                virtualWebSummaryUsage: {
                    virtualWebSummary: {
                        virtualWeb: {
                            id: id
                        }
                    }
                }
            },
            _sum: {
                input: true,
                output: true
            }
        })

        const input = res._sum.input || 0
        const output = res._sum.output || 0

        return {
            input,
            output,
        }
    }

    async sumAnalysisUsage(id: number) {
        const res = await this.client.aIUsage.aggregate({
            where: {
                virtualDomAnalysisUsage: {
                    virtualDomAnalysis: {
                        virtualDom: {
                            virtualWeb: {
                                id: id
                            }
                        }
                    }
                }
            },
            _sum: {
                input: true,
                output: true
            }
        })

        const input = res._sum.input || 0
        const output = res._sum.output || 0


        return {
            input,
            output,
        }
    }

}