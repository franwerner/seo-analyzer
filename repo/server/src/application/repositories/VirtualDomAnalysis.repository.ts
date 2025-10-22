import { AnalysisIssue, PrismaClient } from "@prisma/client";
import { AIUsageType } from "./shared/types/AIUsaga.type";

interface CreateAggregate {
    virtualDomId: number,
    analysisIssues: Array<Omit<AnalysisIssue, 'id' | 'virtualDomAnalysisId'> & { traceIds: Array<string> }>
    AIUsage: AIUsageType
}

const LIMIT = 15

export default class VirtualDomAnalysisRepository {
    constructor(private client: PrismaClient) { }

    create(data: { virtualDomId: number }) {
        return this.client.virtualDomAnalysis.create({ data })
    }

    createAnalysisAggreate({
        analysisIssues,
        AIUsage,
        ...data
    }: CreateAggregate) {

        return this.client.$transaction(async (tx) => {
            const virtualDomAnalysis = await tx.virtualDomAnalysis.create({
                data: {
                    ...data,
                    virtualDomAnalysisUsage: {
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
                    virtualDomId: true,
                }
            })


            const analysisIssuesPromise = analysisIssues.map((analysisIssue) => {
                return tx.analysisIssue.create({
                    data: {
                        ...analysisIssue,
                        virtualDomAnalysisId: virtualDomAnalysis.id,
                    }
                })
            })

            const analysisIssuesRes = await Promise.all(analysisIssuesPromise)

            return {
                ...virtualDomAnalysis,
                analysisIssues: analysisIssuesRes,
            }
        })

    }

    async findUniqueWithIssues({ id }: { id: number }) {

        const res = await this.client.virtualDomAnalysis.findUnique({
            where: { id },
            include: {
                analysisIssue: {
                    select: {
                        id: true,
                        virtualDomAnalysisId: true,
                        traceIds: true,
                        message: true,
                        tag: true,
                        type: true,
                    }
                },
                virtualDomAnalysisUsage: {
                    include: {
                        AIUsage: {
                            select: {
                                input: true,
                                output: true,
                            }
                        }
                    }
                }
            }
        })

        if (!res) return
        const { analysisIssue, virtualDomAnalysisUsage } = res

        return {
            ...res,
            issuesCount: analysisIssue.length,
            analysisUsage: {
                input: Number(virtualDomAnalysisUsage?.AIUsage?.input) || 0,
                output: Number(virtualDomAnalysisUsage?.AIUsage?.output) || 0,
            },
            analysisIssues: analysisIssue
        }
    }

    async findByVirtualDom({ virtualDomId, skip }: { virtualDomId: number, skip: number }) {
        const analysesPromise = this.client.virtualDomAnalysis.findMany({
            where: {
                virtualDomId,
            },
            select: {
                id: true,
                createdAt: true,
                virtualDomId: true,
                _count: {
                    select: {
                        analysisIssue: true
                    }
                },
                virtualDomAnalysisUsage: {
                    select: {
                        AIUsage: {
                            select: {
                                input: true,
                                output: true,
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            skip,
            take: LIMIT
        })

        const hasNextPromise = this.client.virtualDomAnalysis.count({
            where: {
                virtualDomId,
            },
            skip: (skip + LIMIT),
            take: 1,
        })


        const [virtualDomAnalyses, hasNext] = await Promise.all([
            analysesPromise,
            hasNextPromise,
        ])

        return {
            virtualDomAnalyses: virtualDomAnalyses.map(({ virtualDomAnalysisUsage, _count, ...rest }) => ({
                ...rest,
                issuesCount: _count.analysisIssue,
                analysisUsage: {
                    input: Number(virtualDomAnalysisUsage?.AIUsage?.input) || 0,
                    output: Number(virtualDomAnalysisUsage?.AIUsage?.output) || 0,
                }
            })),
            pagination: {
                next: {
                    has: hasNext > 0,
                    skip: skip + LIMIT
                }
            }
        }

    }

}