"use client"
import Container from "@/src/common/components/Container.component";
import Loader from "@/src/common/components/Loader.component";
import ResourceNotFound from "@/src/common/components/ResourceNotFound.component";
import TitleUrl from "@/src/common/components/TitleURL.component";
import UsageCard from "@/src/common/components/UsageCard.component";
import { useParams } from "next/navigation";
import VirtualDomAnalyses from "../../virtual-dom-analysis/components/VirtualDomAnalyses.component";
import useGetVirtualDom from "../hooks/useGetVirtualDom.hook";

export default function VirtualDomView() {

    const { virtualDomId } = useParams()

    const { data, isPending } = useGetVirtualDom(Number(virtualDomId))

    const virtualDom = data?.result

    if (isPending) return <Loader />
    else if (!virtualDom) return <ResourceNotFound message="Virtual DOM not found" />

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