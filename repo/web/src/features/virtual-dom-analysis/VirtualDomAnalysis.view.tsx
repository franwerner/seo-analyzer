"use client"
import Container from "@/src/common/components/Container.component";
import { useParams } from "next/navigation";
import useGetVirtualDomAnalysis from "./hooks/useGetVirtualDomAnalysis.hook";
import Loader from "@/src/common/components/Loader.component";
import UsageCard from "@/src/common/components/UsageCard.component";
import AnalysisIssues from "./components/AnalysisIssues.component";

export default function VirtualDomAnalysisView() {

    const { virtualDomAnalysisId } = useParams()

    const { data, isPending, error, isError } = useGetVirtualDomAnalysis(Number(virtualDomAnalysisId))

    if (isPending) return <Loader />
    else if (isError) throw error
    const { analysisUsage, analysisIssues, createdAt, issuesCount } = data.result

    return (
        <Container className="gap-12">
            <div>
                <h1 className="text-2xl text-center font-semibold">Analysis #{data.result.id}</h1>
                <p className="text-center text-gray-500">Created at {new Date(createdAt).toLocaleString()}</p>
            </div>
            <UsageCard
                label="Usage"
                data={analysisUsage} />
            <AnalysisIssues
                issuesCount={issuesCount}
                analysisIssues={analysisIssues} />
        </Container>
    )
}