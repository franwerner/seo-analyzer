import { PrismaClient, ResourceUsage, VirtualWebSummary } from "@prisma/client";

export default class VirtualWebSummaryRepository {
    constructor(private client: PrismaClient) { }


    createAggregate({
        resourceUsage,
        ...data
    }: Omit<VirtualWebSummary, "id" | "createdAt"> & { resourceUsage: Omit<ResourceUsage, "id" | "createdAt"> }) {
        return this.client.virtualWebSummary.create({
            data: {
                ...data,
                virtualWebSummaryUsage: {
                    create: {
                        resourceUsage: {
                            create: resourceUsage
                        }
                    }
                },
            },
            select: {
                createdAt: true,
                sourceVirtualDomId: true
            }
        })
    }

    findUniqueBySourceVirtualDomId(sourceVirtualDomId: number) {
        return this.client.virtualWebSummary.findFirst({
            where: {
                sourceVirtualDomId,
            },
            orderBy: {
                id: 'desc'
            },
            select: {
                content: true,
                id: true
            }
        })
    }
}