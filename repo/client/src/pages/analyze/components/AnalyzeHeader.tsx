
interface AnalyzeHeaderProps {
    onRegisterAnother: () => void
}

export default function AnalyzeHeader({ onRegisterAnother }: AnalyzeHeaderProps) {
    return (
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
        </div>
    )
}