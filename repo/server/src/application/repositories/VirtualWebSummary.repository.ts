import { AIUsage, PrismaClient, VirtualWebSummary } from "@prisma/client";

export default class VirtualWebSummaryRepository {
    constructor(private client: PrismaClient) { }


    createSummaryAggregate({
        AIUsage,
        ...data
    }: Omit<VirtualWebSummary, "id" | "createdAt"> & { AIUsage: Omit<AIUsage, "id" | "createdAt"> }) {
        return this.client.virtualWebSummary.create({
            data: {
                ...data,
                virtualWebSummaryUsage: {
                    create: {
                        AIUsage: {
                            create: AIUsage
                        }
                    }
                },
            },
            select: {
                id: true,
                createdAt: true,
                virtualWebId: true
            }
        })
    }

    findLastByVirtualWeb(id: number) {
        return this.client.virtualWebSummary.findFirst({
            where: {
                virtualWebId: id,
            },
            orderBy: {
                id: 'desc'
            },
            select: {
                id: true,
                content: true,
                createdAt: true,
            }
        })
    }
}