import calcCostInputToken from "../services/calcCostInputToken.service";
import calcCostOutputToken from "../services/calcCostOutputToken.service";

export default function TokenConsumption({
    input,
    output
}: {
    input: number;
    output: number;
}) {
    const inputCost = calcCostInputToken(input);
    const outputCost = calcCostOutputToken(output);
    const totalCost = inputCost + outputCost;
    return (
        <div className="bg-emerald-100 border border-emerald-300 rounded-md p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-emerald-700">Consumo de Tokens</h2>
            <p className="text-emerald-800 mt-1">
                <strong>Entrada:</strong> {input.toLocaleString()} tokens ≈ ${inputCost.toFixed(4)}
            </p>
            <p className="text-emerald-800">
                <strong>Salida:</strong> {output.toLocaleString()} tokens ≈ ${outputCost.toFixed(4)}
            </p>
            <p className="mt-2 text-emerald-900 font-semibold">
                <strong>Total :</strong> ${totalCost.toFixed(4)}
            </p>
        </div>
    )
}