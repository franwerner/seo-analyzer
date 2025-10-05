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

const Content = ({ historyValidations }: ContentProps) => {
    const [history, setHistory] = useState<Array<SeoDetails>>(historyValidations)

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

    const isLoading = status === "loading"

    const [{ matches }, nav] = useRouter()


    const handleFetch = () => {
        setSelectedIndex(-1)
        fetchData(`/analyze?domain=${matches?.domain}&path=${matches?.path}`, {
            onSuccess: ({
                issues,
                tokens,
            }) => {
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

    const [{ matches }] = useRouter()

    const { fetchData, response } = useFetch<{ validations: Array<SeoDetails> }>()

    const {
        status,
        data
    } = response

    useEffect(() => {
        fetchData(`/validations?url=${matches?.url}`)
    }, [])

    return status === "loading" ?
        <div className="flex justify-center items-center h-screen">
            <Loading text="Cargando historial de analisis..." />
        </div>
        : <Content historyValidations={data?.validations || []} />
}

