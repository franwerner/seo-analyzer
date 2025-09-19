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
