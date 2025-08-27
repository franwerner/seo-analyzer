import { useRouter } from "preact-router";
import { useEffect, useState } from "preact/hooks";
import Loading from "@/components/loading.component";
import useFetch from "@/hooks/useFetch.hook";
import type { SeoDetails } from "@/types/seoDetailsInterface.type";
import TokenModal from "./components/tokenModal.component";
import calcCostInputToken from "./services/calcCostInputToken.service";
import calcCostOutputToken from "./services/calcCostOutputToken.service";

const TokenConsumption = ({
    input,
    output
}: {
    input: number;
    output: number;
}) => {
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

const Issues = ({ issues }: { issues: SeoDetails['issues'] }) => {
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold text-sky-600">Problemas Detectados</h2>

            {issues.length === 0 ? (
                <p className="text-gray-600">✅ No se encontraron problemas técnicos.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {issues.map((issue, index) => (
                        <div
                            key={index}
                            className="bg-white shadow rounded-md p-4 border border-sky-200 overflow-hidden break-words"
                        >
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-semibold text-sky-700 uppercase truncate">
                                    {`<${issue.tag}>`}
                                </span>
                            </div>

                            <p className="mt-2 text-gray-800 text-sm break-words whitespace-pre-line">
                                {issue.message}
                            </p>

                            <div className="mt-3 text-sm text-gray-500 break-words whitespace-pre-wrap">
                                <strong>ID(s):</strong>{" "}
                                {issue.traceIds.join(", ")}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}


const Feedback = ({ feedback }: { feedback: SeoDetails['feedback'] }) => {
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-sky-600">Feedback General</h2>
            {feedback.length === 0 ?
                <p className="text-gray-600">📌 No hay sugerencias adicionales.</p>
                :
                <ul className="list-disc list-inside space-y-2">
                    {feedback.map((item, idx) => (
                        <li key={idx} className="text-gray-800">
                            {item}
                        </li>
                    ))}
                </ul>
            }
        </div>
    )
}



const AnalyzeComponent = () => {

    const {
        fetchData,
        response
    } = useFetch<SeoDetails>()


    const {
        status,
        data
    } = response

    const [{ matches }] = useRouter()


    const handleFetch = () => {
        fetchData(`/analyze?url=${matches?.url}`)
    }

    useEffect(() => {
        handleFetch()
    }, [])

    return (
        <div className="py-8 px-8">
            {status === "loading" ?
                <div className="flex justify-center items-center h-screen">
                    <Loading text="Realizando análisis SEO..." />
                </div>
                :
                <div className="mx-auto space-y-10">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-sky-700">Resultados del Análisis SEO</h1>
                        <button
                            type="button"
                            onClick={handleFetch}
                            className="px-4 py-2 rounded-md bg-sky-600 hover:bg-sky-700 text-white font-medium transition"
                        >
                            Reintentar
                        </button>
                    </div>
                    {status === "failed" &&
                        <div className="flex justify-center items-center h-24">
                            <p className="text-red-600 text-sm text-center font-medium">
                                {data?.message}
                            </p>
                        </div>
                    }
                    {status === "success" && data && (
                        <>
                            <TokenConsumption input={data.tokens.input} output={data.tokens.output} />
                            <Issues issues={data.issues} />
                            <Feedback feedback={data.feedback} />
                        </>
                    )}
                </div>
            }
        </div>
    )
}

export default function AnalyzePage() {

    const [isConfirmed, setIsConfirmed] = useState(false)

    return isConfirmed ?
        <AnalyzeComponent /> :
        <TokenModal onConfirm={() => setIsConfirmed(true)} />
}

