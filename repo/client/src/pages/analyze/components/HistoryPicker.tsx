import type { SeoDetails } from "@/types/seoDetailsInterface.type"

interface HistoryPickerProps {
    selectedIndex: number | null
    handleSelect: (index: number) => void
    history: Array<SeoDetails>
    isLoading: boolean
    onRetry: () => void
};

export default function HistoryPicker({
    selectedIndex,
    handleSelect,
    history,
    isLoading,
    onRetry
}: HistoryPickerProps) {

    return (
        <div className="border rounded-md p-4 space-y-2 bg-gray-50">
            <h2 className="font-bold text-sky-700">Historial de Análisis</h2>
            {history.length === 0 && <p className="text-gray-500">No hay análisis previos</p>}
            <ul className="space-y-1 group max-h-60 flex gap-x-4 gap-y-1 flex-wrap overflow-y-auto">
                {history.map((item, index) => (
                    <li
                        key={index}
                        onClick={() => handleSelect(index)}
                        className={`cursor-pointer h-full border border-sky-100 p-2 rounded-md hover:bg-sky-100 transition ${selectedIndex === index ? "bg-sky-200" : ""
                            }`}
                    >
                        <span className="text-sm text-sky-600">
                            Análisis #{index + 1} — Tokens: {item.tokens.input + item.tokens.output}
                        </span>
                    </li>
                ))}
                {isLoading && (
                    <li
                        onClick={() => handleSelect(-1)}
                        className="p-2 rounded-md h-full animate-pulse border-sky-200 cursor-pointer transition border bg-sky-300 ">
                        <span className="text-sm font-semibold text-white">
                            {`Análisis #${history.length + 1}`} - Cargando...
                        </span>
                    </li>
                )}
                {!isLoading && (
                    <li className="h-full">
                        <button
                            onClick={onRetry}
                            className=" p-2 h-full rounded-md bg-sky-600 border border-sky-600 hover:border-sky-400  cursor-pointer transition hover:bg-sky-400 text-sky-600 ">
                            <span className="text-sm text-white font-semibold">
                                {`Empezar Análisis #${history.length + 1}`}
                            </span>
                        </button>
                    </li>
                )}
            </ul>
        </div>
    )
}
