import UsageCard from "@/src/common/components/UsageCard.component";
import { Button } from "@heroui/button";
import { GetVirtualWebDetailsDTO } from "@seo-analyzer/common";
import Link from "next/link";
import { useParams } from "next/navigation";

interface AditionalInfoProps {
    createdAt: Date;
    virtualDomCount: number;
}

const AditionalInfo = ({ createdAt, virtualDomCount }: AditionalInfoProps) => {
    const stats = [
        { label: "Created at", value: createdAt.toLocaleDateString(), color: "bg-warning/20 text-warning-700" },
        { label: "Virtual DOM Count", value: virtualDomCount, color: "bg-primary/20 text-primary-700" },
    ];
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {stats.map((item, idx) => (
                <div
                    key={idx}
                    className={`flex justify-between bg-emerald-50 items-center p-4 rounded-xl ${item.color} `}
                >
                    <span className="font-medium">{item.label}</span>
                    <span className="font-medium">{item.value}</span>
                </div>
            ))}
        </div>
    )
}


const UsageInfo = ({ summaryUsage, analysisUsage }: Pick<GetVirtualWebDetailsDTO["output"], "summaryUsage" | "analysisUsage">) => {

    const usages = [
        {
            label: "Summary Consumed",
            data: summaryUsage,
        },
        {
            label: "Analysis Consumed",
            data: analysisUsage,

        },
    ]

    return (
        <div className="flex flex-col gap-4">
            {usages.map((cons) => <UsageCard
                key={cons.label}
                label={cons.label}
                data={cons.data} />)}
        </div>
    )
}


export default function VirtualWebStatistics({
    analysisUsage,
    createdAt,
    summaryUsage,
    virtualDomCount
}: Pick<GetVirtualWebDetailsDTO["output"], "createdAt" | "virtualDomCount" | "summaryUsage" | "analysisUsage">) {
    const { virtualWebId } = useParams()

    return (
        <div className="w-full p-2 gap-4 justify-between flex flex-col h-full">
            <AditionalInfo
                createdAt={new Date(createdAt)}
                virtualDomCount={virtualDomCount} />
            <UsageInfo
                summaryUsage={summaryUsage}
                analysisUsage={analysisUsage} />
            <div className="w-full flex-1">
                <Link href={`/virtualWeb/${virtualWebId}/virtualDom`} className="block w-full h-full">
                    <Button
                        color="success"
                        size="lg"
                        className="w-full text-lg font-medium"
                        variant="flat"
                    >
                        Virtual dom list
                    </Button>
                </Link>
            </div>
        </div>
    );
}