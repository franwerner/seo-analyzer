import Loading from "@/components/loading.component";

export default function AnalysisLoading() {
    return (
        <div className="flex justify-center items-center h-full">
            <Loading text="Realizando análisis SEO..." />
        </div>
    )
}