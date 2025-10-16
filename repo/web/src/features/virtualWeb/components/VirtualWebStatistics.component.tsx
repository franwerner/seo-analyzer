import formatUSD from "@/src/common/utils/formatUSD.util";

export interface Consumption {
    input: number;
    output: number;
    total: number;
}

export interface VirtualWebInfoProps {
    createdAt: string;
    virtualDomCount: number
    summaryTotalConsumed: Consumption
    analysisTotalConsumed: Consumption
}

export default function VirtualWebStatistics({
    createdAt,
    virtualDomCount,
    summaryTotalConsumed,
    analysisTotalConsumed,
}: VirtualWebInfoProps) {
    const stats = [
        { label: "Created at", value: createdAt, color: "bg-warning/20 text-warning-700" },
        { label: "Virtual DOM Count", value: virtualDomCount, color: "bg-primary/20 text-primary-700" },
    ];

    const consumptions = [
        {
            label: "Summary Consumed",
            data: summaryTotalConsumed,
            colors: { input: "bg-success-400", output: "bg-success/20 text-success-700" },
        },
        {
            label: "Analysis Consumed",
            data: analysisTotalConsumed,
            colors: { input: "bg-emerald-400", output: "bg-emerald-100 text-emerald-700" },
        },
    ];

    return (
        <div className="w-full p-2 h-full">

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

            <div className="flex flex-col gap-4">
                {consumptions.map((cons, idx) => (
                    <div
                        key={idx}
                        className="p-4 rounded-xl bg-white shadow-sm flex flex-col gap-3 border border-gray-200"
                    >
                        <h4 className="font-semibold ">{cons.label}</h4>

                        {(["input", "output"] as const).map((key) => (
                            <div key={key} className="flex flex-col gap-1">
                                <div className="flex justify-between text-sm ">
                                    <span>{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
                                    <span className="font-medium">{formatUSD(cons.data[key])}</span>
                                </div>
                                <div className="w-full h-3 rounded-full bg-gray-200 overflow-hidden">
                                    <div
                                        className={`${cons.colors[key]} h-3 rounded-full transition-all`}
                                        style={{ width: `${(cons.data[key] / cons.data.total) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}

                        <div className="flex justify-between mt-2 items-center">
                            <span className="font-medium text-gray-800">Total:</span>
                            <span
                                className={`font-medium  px-3 py-1 rounded-full ${cons.colors.output}`}
                            >
                                {formatUSD(cons.data.total)}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}