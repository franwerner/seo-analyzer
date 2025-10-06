import useFetch from "@/hooks/useFetch.hook";
import type { SeoDetails } from "@/types/seoDetailsInterface.type";
import { useRouter } from "preact-router";
import { useEffect, useState } from "preact/hooks";
import AnalysisLoading from "./components/AnalysisLoading";
import AnalyzeHeader from "./components/AnalyzeHeader";
import HistoryPicker from "./components/HistoryPicker";
import IssuesList from "./components/IssuesList";
import TokenConsumption from "./components/TokenConsumption";
import Loading from "@/components/loading.component";
import type { ValidationType } from "@/types/ValidationType.type";


type AnalysisResultProps = {
    data: SeoDetails
}

const AnalysisResult = ({ data }: AnalysisResultProps) => (
    <div className="space-y-4 pb-8">
        <TokenConsumption
            input={data.tokens.input}
            output={data.tokens.output} />
        <IssuesList issues={data.issues} />
    </div>
)

interface ContentProps {
    historyValidations: Array<SeoDetails>
}


interface ValidationTypeSelectorProps {
    selected: ValidationType[]
    onChange: (selected: ValidationType[]) => void
}

const validationOptions: { label: string; value: ValidationType }[] = [
    // { label: "Schema", value: "schema" },
    { label: "Semantic", value: "semantic" },
    { label: "Spelling", value: "spelling" },
    { label: "Structure", value: "structure" },
    { label: "General", value: "general" },
]

export const ValidationTypeSelector = ({ selected, onChange }: ValidationTypeSelectorProps) => {

    const handleToggle = (value: ValidationType) => {
        if (selected.includes(value)) {
            onChange(selected.filter(v => v !== value))
        } else {
            onChange([...selected, value])
        }
    }

    return (
        <div className="flex flex-wrap gap-3">
            {validationOptions.map(({ label, value }) => {
                const isSelected = selected.includes(value)

                return (
                    <button
                        key={value}
                        type="button"
                        onClick={() => handleToggle(value)}
                        className={`
                flex items-center gap-2 rounded-full cursor-pointer px-4 py-2 text-sm font-medium transition-all duration-200
                border ${isSelected ? "border-sky-500 bg-sky-500 text-white shadow-md" : "border-sky-200 bg-sky-50 text-sky-700"}
                hover:scale-[1.03] hover:shadow-sm active:scale-[0.97]
              `}
                    >
                        <div
                            className={`w-3 h-3 rounded-full border-2 ${isSelected ? "border-white bg-white/80" : "border-sky-400"
                                }`}
                        ></div>
                        {label}
                    </button>
                )
            })}
        </div>
    )
}

const Content = ({ historyValidations }: ContentProps) => {
    const [history, setHistory] = useState<Array<SeoDetails>>(historyValidations)

    const [selectedIndex, setSelectedIndex] = useState<number>(0)
    const [selectedValidations, setSelectedValidations] = useState<ValidationType[]>(["general"])

    const currentHistory = history[selectedIndex]

    const {
        fetchData,
        response
    } = useFetch<{ analysis: SeoDetails }>()

    const {
        status,
        data
    } = response

    const isLoading = status === "loading"

    const [{ matches }, nav] = useRouter()


    const handleFetch = () => {
        setSelectedIndex(-1)
        fetchData(`/virtual-web/create-single-analysis`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                host: matches?.host,
                path: matches?.path,
                validationTypes: selectedValidations,
            }),
            onSuccess: ({
                analysis,
            }) => {
                const { issues, tokens } = analysis
                setHistory(prev => [...prev, {
                    issues,
                    tokens,
                }])
                setSelectedIndex(history.length)
            }
        })
    }

    return (
        <main className="py-8 max-w-7xl w-full mx-auto px-8 space-y-5 flex flex-col gap-4 h-screen">

            <div className="space-y-3">
                <h2 className="text-sky-700 font-semibold text-lg">Select Validation Types</h2>
                <ValidationTypeSelector
                    selected={selectedValidations}
                    onChange={setSelectedValidations}
                />
            </div>
            <HistoryPicker
                selectedIndex={selectedIndex}
                onRetry={handleFetch}
                handleSelect={setSelectedIndex}
                history={history}
                isLoading={isLoading}
            />

            {isLoading && selectedIndex === -1 ?
                <AnalysisLoading />
                :
                <div className="w-full space-y-10">
                    <AnalyzeHeader
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
        </main>
    )
}

export default function AnalyzePage() {

    const [{ matches }, nav] = useRouter()

    const { fetchData, response } = useFetch<{ analysis: Array<SeoDetails>, type: string }>()

    const {
        status,
        data
    } = response

    useEffect(() => {
        fetchData(`/virtual-web/analysis/?path=${matches?.path}&host=${matches?.host}`, {
            onFailed(data) {
                if (data.type === "VirtualWebNotFound") {
                    nav("/")
                }
            },
        })
    }, [])

    return status === "loading" ?
        <div className="flex justify-center items-center h-screen">
            <Loading text="Cargando historial de analisis..." />
        </div>
        : <Content historyValidations={data?.analysis || []} />
}

