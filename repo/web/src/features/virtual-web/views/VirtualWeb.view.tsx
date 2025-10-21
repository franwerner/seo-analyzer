"use client"
import Container from "@/src/common/components/Container.component";
import Loader from "@/src/common/components/Loader.component";
import TitleUrl from "@/src/common/components/TitleURL.component";
import { useParams } from "next/navigation";
import VirtualWebStatistics from "../components/VirtualWebStatistics.component";
import VirtualWebSummaryCard from "../components/VirtualWebSummaryCard.component";
import useGetVirtualWebDetails from "../hooks/useGetVirtualWebDetails.hook";


export default function VirtualWebView() {

    const { virtualWebId } = useParams()

    const { data, isPending, error, isError } = useGetVirtualWebDetails(Number(virtualWebId))

    if (isPending) return <Loader />
    else if (isError) throw error

    const { createdAt, virtualDomCount, summaryUsage, analysisUsage, host, virtualWebSummary } = data.result

    return (
        <Container className="gap-14">
            <TitleUrl url={host} />
            <div className="grid grid-cols-1 pb-8  md:h-[550px] md:grid-cols-2 gap-6 items-start">
                <VirtualWebSummaryCard
                    virtualWebSummary={virtualWebSummary}
                />
                <VirtualWebStatistics
                    createdAt={createdAt}
                    virtualDomCount={virtualDomCount}
                    summaryUsage={summaryUsage}
                    analysisUsage={analysisUsage} />
            </div>
        </Container>
    );
}