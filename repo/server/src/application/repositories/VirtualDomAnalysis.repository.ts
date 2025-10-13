import { AnalysisIssue, PrismaClient, ResourceUsage } from "@prisma/client";



interface CreateAggregate {
    virtualDomId: number,
    analysisIssues: Array<Omit<AnalysisIssue, 'id' | 'virtualDomAnalysisId'> & { traceIds: Array<string> }>
    resourceUsage: Omit<ResourceUsage, 'id'>
}

export default class VirtualDomAnalysisRepository {
    constructor(private client: PrismaClient) { }

    create(data: { virtualDomId: number }) {
        return this.client.virtualDomAnalysis.create({ data })
    }


    createAnalysisAggreate({
        analysisIssues,
        resourceUsage,
        ...data
    }: CreateAggregate) {

        return this.client.$transaction(async (tx) => {

            const { id: virtualDomAnalysisId } = await tx.virtualDomAnalysis.create({
                data: {
                    ...data,
                    virtualDomAnalysisUsage: {
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


            for (const analysisIssue of analysisIssues) {
                const { traceIds, ...rest } = analysisIssue
                await tx.analysisIssue.create({
                    data: {
                        ...rest,
                        virtualDomAnalysisId,
                        issueTraceId: {
                            createMany: {
                                data: traceIds.map((traceId) => ({ traceId })),
                                skipDuplicates: true
                            }
                        },

                    }
                })
            }

        })

    }
}