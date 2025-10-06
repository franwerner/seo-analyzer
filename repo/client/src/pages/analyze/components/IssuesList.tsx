import type { SeoDetails } from "@/types/seoDetailsInterface.type"

export default function IssuesList({ issues }: { issues: SeoDetails['issues'] }) {
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
                            className="bg-white shadow rounded-2xl p-4 border border-sky-200 overflow-hidden break-words transition hover:shadow-lg"
                        >
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-semibold text-sky-700 uppercase truncate">
                                    {`<${issue.tag}>`}
                                </span>
                            </div>

                            <p className="mt-2 text-gray-700 text-sm break-words whitespace-pre-line">
                                {issue.message}
                            </p>

                            <p className="mt-3 inline-block px-2 py-1 text-xs font-medium text-sky-700 bg-sky-100 rounded-full">
                                Tipo de análisis: <span className="uppercase">{issue.type}</span>
                            </p>
                            <p className="text-xs mt-3 text-black/60">IDS : {issue.traceIds.join(", ")}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
