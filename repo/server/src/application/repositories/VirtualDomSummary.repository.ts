import { PrismaClient, ResourceUsage, VirtualDomSummary } from "@prisma/client";

export default class VirtualDomSummaryRepository {
    constructor(private client: PrismaClient) { }


    createSummaryAggregate({
        resourceUsage,
        ...data
    }: Omit<VirtualDomSummary, "id" | "createdAt"> & { resourceUsage: Omit<ResourceUsage, "id" | "createdAt"> }) {
        return this.client.virtualDomSummary.create({
            data: {
                ...data,
                virtualDomSummaryUsage: {
                    create: {
                        resourceUsage: {
                            create: resourceUsage
                        }
                    }
                },
            },
            select: {
                id: true,
            }
        })
    }

    findLastByVirtualDomId(virtualDomId: number) {
        return this.client.virtualDomSummary.findFirst({
            where: {
                virtualDomId,
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