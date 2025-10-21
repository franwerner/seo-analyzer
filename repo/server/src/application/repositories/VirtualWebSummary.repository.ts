import { PrismaClient, VirtualWebSummary } from "@prisma/client";
import { AIUsageType } from "./shared/types/AIUsaga.type";

export default class VirtualWebSummaryRepository {
    constructor(private client: PrismaClient) { }


    createSummaryAggregate({
        AIUsage,
        ...data
    }: Omit<VirtualWebSummary, "id" | "createdAt"> & { AIUsage: AIUsageType }) {
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

}