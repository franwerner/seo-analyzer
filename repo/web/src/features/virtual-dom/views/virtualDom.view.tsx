"use client"
import Container from "@/src/common/components/Container.component";
import Loader from "@/src/common/components/Loader.component";
import TitleUrl from "@/src/common/components/TitleURL.component";
import UsageCard from "@/src/common/components/UsageCard.component";
import { useParams } from "next/navigation";
import VirtualDomAnalyses from "../../virtual-dom-analysis/components/VirtualDomAnalyses.component";
import useGetVirtualDom from "../hooks/useGetVirtualDom.hook";

export default function VirtualDomView() {

    const { virtualDomId } = useParams()

    const { data, isPending, error, isError } = useGetVirtualDom(Number(virtualDomId))


    if (isPending) return <Loader />
    else if (isError) throw error


    const virtualDom = data.result
    const url = virtualDom.virtualWeb.host + virtualDom.pathname

    return (
        <Container className="gap-8">
            <TitleUrl url={url} />
            <UsageCard
                data={virtualDom.analysesUsage}
                label="Total Analysis Usage"
            />
            <VirtualDomAnalyses />
        </Container>
    )
}