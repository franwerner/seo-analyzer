import { Usage } from "@packages/common";
import formatUSD from "../utils/formatUSD.util";


interface UsageProps {
    label: string;
    data: Usage
}


const colors = {
    input: "bg-emerald-400",
    output: "bg-emerald-100"
}

export default function UsageCard({ label, data }: UsageProps) {
    return (
        <div
            key={label}
            className="p-4 rounded-xl bg-white shadow-sm flex flex-col gap-3 border border-gray-200">
            <h4 className="font-semibold ">{label}</h4>

            {(["input", "output"] as const).map((key) => (
                <div
                    key={key}
                    className="flex flex-col gap-1">
                    <div className="flex justify-between text-sm ">
                        <span>{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
                        <span className="font-medium">{formatUSD(data[key])}</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-gray-200 overflow-hidden">
                        <div
                            className={`${colors[key]} h-3 rounded-full transition-all`}
                            style={{ width: `${((data[key] / data.total) * 100) || 0}%` }}
                        >

                        </div>
                    </div>
                </div>
            ))}
            <div className="flex justify-between mt-2 items-center">
                <span className="font-medium text-gray-800">Total:</span>
                <span
                    className={`font-medium  px-3 py-1 rounded-full  bg-emerald-100 text-emerald-700`}>
                    {formatUSD(data.total)}
                </span>
            </div>
        </div>
    )
}