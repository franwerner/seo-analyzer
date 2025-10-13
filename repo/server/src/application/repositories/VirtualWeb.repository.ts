import { PrismaClient } from "@prisma/client";

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
                omit: {
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
                }

            })

            const virtualWebConfig = await tx.virtualWebConfig.create({
                data: {
                    virtualWebId: virtualWeb.id,
                    mainVirtualDomId: virtualDom.id,
                },
                select: {
                    mainVirtualDomId: true,
                    virtualWebId: true
                }
            })

            return {
                virtualWeb,
                virtualWebConfig: {
                    mainVirtualDomId: virtualWebConfig.mainVirtualDomId,
                }
            }

        })
    }

    async findUniqueWithConfig(id: number) {

        const res = await this.client.virtualWeb.findUnique({
            where: {
                id,
            },
            include: {
                virtualWebConfig: {
                    include: {
                        virtualDom: {
                            select: {
                                pathname: true
                            }
                        },
                    },

                },
            },
            omit: {
                createdAt: true
            },
        })

        if (!res) return null

        const { virtualWebConfig, ...virtualWeb } = res

        return {
            virtualWeb,
            virtualWebConfig: !virtualWebConfig ? null : {
                mainVirtualDomId: virtualWebConfig.mainVirtualDomId,
                mainPathname: virtualWebConfig.virtualDom.pathname
            }
        }

    }


}