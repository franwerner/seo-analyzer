"use client"
import Loader from "@/src/common/components/Loader.component";
import ResourceNotFound from "@/src/common/components/ResourceNotFound.component";
import ShowMoreButton from "@/src/common/components/ShowMoreButton.component";
import formatUSD from "@/src/common/utils/formatUSD.util";
import { Button } from "@heroui/button";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/table";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import useGetVirtualDomAnalysis from "../hooks/useGetVirtualDomAnalyses.hook";
import CreateAnalysisModal from "./CreateAnalysisModal.component";

const ModalContainer = () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="flex gap-4  items-center justify-center">
            <h2 className="text-2xl text-default-800 font-semibold">Analyses</h2>
            <Button
                color="secondary"
                variant="flat"
                className="font-medium text-xs uppercase"
                onPress={() => setIsOpen(true)}
            >
                + Analysis
            </Button>
            <CreateAnalysisModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />
        </div>
    )
}


export default function VirtualDomAnalyses() {

    const router = useRouter()
    const { virtualDomId } = useParams()

    const { data, isPending, fetchNextPage, hasNextPage, error, isError } = useGetVirtualDomAnalysis(Number(virtualDomId))

    if (isPending) return <Loader />
    else if (isError) throw error

    const analysis = data.pages.flatMap(page => page.result.virtualDomAnalyses)

    return (
        <div className="flex h-full flex-col flex-1 justify-start items-center py-8 gap-8">
            <ModalContainer />
            {analysis.length == 0 ?
                <ResourceNotFound message="No analyses available" /> :
                <Table>
                    <TableHeader>
                        <TableColumn className="text-center">ID</TableColumn>
                        <TableColumn className="text-center">Created At</TableColumn>
                        <TableColumn className="text-center">Issues</TableColumn>
                        <TableColumn className="text-center">Input</TableColumn>
                        <TableColumn className="text-center">Output</TableColumn>
                        <TableColumn className="text-center">Total</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {analysis.map((analysis) => (
                            <TableRow
                                key={analysis.id}
                                onClick={() => router.push(`${virtualDomId}/analyses/${analysis.id}`)}
                                className="cursor-pointer hover:bg-secondary-100 hover:!text-secondary-600 rounded-2xl transition-colors">
                                <TableCell className="text-center">{analysis.id}</TableCell>
                                <TableCell className="text-center">{new Date(analysis.createdAt).toLocaleString()}</TableCell>
                                <TableCell className="text-center">{analysis.issuesCount}</TableCell>
                                <TableCell className="text-center">{formatUSD(analysis.analysisUsage.input)}</TableCell>
                                <TableCell className="text-center">{formatUSD(analysis.analysisUsage.output)}</TableCell>
                                <TableCell className="text-center">{formatUSD(analysis.analysisUsage.input + analysis.analysisUsage.output)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            }
            <ShowMoreButton
                fetchNextPage={fetchNextPage}
                isLoading={isPending}
                hasNextPage={hasNextPage}
            />
        </div>
    )
}