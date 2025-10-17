"use client"
import Container from "@/src/common/components/Container.component";
import Loader from "@/src/common/components/Loader.component";
import { Link as HLink } from "@heroui/link";
import { notFound, useParams } from "next/navigation";
import VirtualWebStatistics from "./components/VirtualWebStatistics.component";
import VirtualWebSummaryCard from "./components/VirtualWebSummaryCard.component";
import useGetVirtualWebDetails from "./hooks/useGetVirtualWebDetails.hook";
import Link from "next/link";

export default function VirtualWebView() {

    const { virtualWebId } = useParams()

    const { data, isPending } = useGetVirtualWebDetails(Number(virtualWebId))

    if (isPending) return <Loader />
    else if (!data?.result) return notFound()

    const { createdAt, virtualDomCount, summaryUsage, analysisUsage, host, virtualWebSummary } = data.result

    return (
        <Container className="gap-14">
            <h1 className="text-center  text-4xl md:text-5xl font-extrabold uppercase  bg-clip-text text-transparent 
               bg-gradient-to-r from-primary-600 to-secondary-500 drop-shadow-md">
                <HLink
                    isExternal
                    showAnchorIcon
                    color="foreground"
                    underline="always"
                    className="text-2xl"
                    as={Link}
                    href={`https://${host}`}>
                    {host}
                </HLink>
            </h1>

            <div className="grid grid-cols-1 pb-8  md:h-[700px] md:grid-cols-2 gap-6 items-start">
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