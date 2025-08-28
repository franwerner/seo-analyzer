import { useRouter } from "preact-router";
import { useEffect, useState } from "preact/hooks";
import Loading from "@/components/loading.component";
import useFetch from "@/hooks/useFetch.hook";
import type { SeoDetails } from "@/types/seoDetailsInterface.type";
import TokenModal from "./components/tokenModal.component";
import calcCostInputToken from "./services/calcCostInputToken.service";
import calcCostOutputToken from "./services/calcCostOutputToken.service";
import seoDetailsMock from "@/mocks/seoDetails.mock";

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
        <div className="space-y-4 p-1">
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
type HistoryPickerProps = {
    selectedIndex: number | null
    handleSelect: (index: number) => void
    history: Array<SeoDetails>
};


const HistoryPicker = ({ selectedIndex, handleSelect, history }: HistoryPickerProps) => {

    return (
        <div className="border rounded-md p-4 space-y-2 bg-gray-50">
            <h2 className="font-bold text-sky-700">Historial de Análisis</h2>
            {history.length === 0 && <p className="text-gray-500">No hay análisis previos</p>}
            <ul className="space-y-1 max-h-60 flex gap-x-4 gap-y-1 flex-wrap overflow-y-auto">
                {history.map((item, index) => (
                    <li
                        key={index}
                        onClick={() => handleSelect(index)}
                        className={`cursor-pointer p-2 rounded-md hover:bg-sky-100 transition ${selectedIndex === index ? "bg-sky-200" : ""
                            }`}
                    >
                        <span className="text-sm text-gray-700">
                            Análisis #{index + 1} — Tokens: {item.tokens.input + item.tokens.output}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    )
}

type AnalyzeHeaderProps = {
    onRetry: () => void
    onRegisterAnother: () => void
}

const AnalyzeHeader = ({ onRetry, onRegisterAnother }: AnalyzeHeaderProps) => (
    <div className="flex items-center justify-between">
        <div>
            <h1 className="text-2xl font-bold text-sky-700">Resultados del Análisis SEO</h1>
            <span className="text-sm text-gray-600">
                Ten en cuenta que cualquier modificación en la web deberas registrarla nuevamente.{" "}
                <span
                    onClick={onRegisterAnother}
                    className="text-sky-700 cursor-pointer font-medium hover:underline"
                >
                    Registrar otra Web
                </span>
            </span>
        </div>
        <button
            type="button"
            onClick={onRetry}
            className="px-4 py-2 rounded-md bg-sky-600 hover:bg-sky-700 text-white font-medium transition"
        >
            Reintentar
        </button>
    </div>
)

type AnalysisResultProps = {
    data: SeoDetails
}

const AnalysisResult = ({ data }: AnalysisResultProps) => (
    <div className="space-y-4">
        <TokenConsumption input={data.tokens.input} output={data.tokens.output} />
        <Issues issues={data.issues} />
        <Feedback feedback={data.feedback} />
    </div>
)

const AnalysisLoading = () => {
    return (
        <div className="flex justify-center items-center h-full">
            <Loading text="Realizando análisis SEO..." />
        </div>
    )
}

const AnalyzeComponent = () => {

    const [history, setHistory] = useState<Array<SeoDetails>>([])
    const [selectedIndex, setSelectedIndex] = useState<number>(0)

    const currentHistory = history[selectedIndex]

    const {
        fetchData,
        response
    } = useFetch<SeoDetails>()

    const {
        status,
        data
    } = response

    const [{ matches }, nav] = useRouter()


    const handleFetch = () => {
        fetchData(`/analyze?url=${matches?.url}`, {
            onSuccess: ({
                feedback,
                issues,
                tokens,
            }) => {
                setHistory(prev => [...prev, {
                    feedback,
                    issues,
                    tokens,
                }])
                setSelectedIndex(history.length)
            }
        })
    }

    useEffect(() => {
        handleFetch()
    }, [])

    return (
        <div className="py-8 px-8 flex flex-col gap-4 h-screen">
            <HistoryPicker
                selectedIndex={selectedIndex}
                handleSelect={setSelectedIndex}
                history={history}
            />
            {status === "loading" ?
                <AnalysisLoading />
                :
                <div className="mx-auto space-y-10">
                    <AnalyzeHeader
                        onRetry={handleFetch}
                        onRegisterAnother={() => nav("/")}
                    />

                    {status === "failed" && (
                        <div className="flex justify-center bg-red-500 text-white rounded-xl items-center h-24">
                            <p className="text-sm text-center font-medium">
                                {data?.message}
                            </p>
                        </div>
                    )}

                    {currentHistory && <AnalysisResult data={currentHistory} />}
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

