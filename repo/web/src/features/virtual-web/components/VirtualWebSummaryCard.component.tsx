"use client"
import { Button } from "@heroui/button";
import { VirtualWebSummary } from "@packages/common";
import useCreateVirtualWebSummary from "../hooks/useCreateVirtualWebSummary.hook";
import { useParams } from "next/navigation";

interface WebSummaryGeneratorProps {
    virtualWebSummary?: VirtualWebSummary | null;
}

const SummaryGenerator = () => {

    const { virtualWebId } = useParams()

    const { isPending, mutate } = useCreateVirtualWebSummary(Number(virtualWebId))

    return (
        <div className="flex flex-col gap-6 flex-1 justify-center  items-center ">
            <p className="text-default-500 italic text-center">
                No summary available. Please generate one.
            </p>
            <Button
                onPress={() => {
                    mutate()
                }}
                color="default"
                variant="flat"
                isLoading={isPending}
                className="bg-default-900 py-8 px-8 text-white">
                {isPending ? "Generating..." : "Generate Summary"}
            </Button>
        </div>
    )
}

export default function VirtualWebSummaryCard({ virtualWebSummary }: WebSummaryGeneratorProps) {

    return (
        <div className="h-full max-md:h-[500px] border flex flex-col overflow-y-auto gap-4 border-default-200 shadow rounded-xl p-5">
            <div className="flex justify-between items-center">
                <h3 className="font-semibold text-2xl text-default-900">
                    Web Summary
                </h3>
                {
                    virtualWebSummary && (
                        <span className="text-sm bg-danger/20 text-danger-700 font-medium px-2 py-1 rounded-2xl">
                            {new Date(virtualWebSummary.createdAt).toLocaleDateString()}
                        </span>
                    )
                }
            </div>
            {virtualWebSummary ?
                <p className="text-default-700 p-2">
                    {virtualWebSummary.content}
                </p>
                :
                <SummaryGenerator />
            }
        </div>
    );
}