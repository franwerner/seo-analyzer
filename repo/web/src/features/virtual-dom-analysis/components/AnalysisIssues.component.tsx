"use client";

import { Card, CardHeader, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Tooltip } from "@heroui/tooltip";
import { AlertTriangle, FileText, SpellCheck, Layout, Image } from "lucide-react";
import { JSX } from "react";
import { ValidationTypeEnum, AnalysisIssue } from "@seo-analyzer/common";
import clsx from "clsx";


const typeColors: Record<ValidationTypeEnum, string> = {
    scheme: "bg-purple-100 text-purple-700",
    semantic: "bg-blue-100 text-blue-700",
    spelling: "bg-orange-100 text-orange-700",
    resource: "bg-red-100 text-red-700",
    structure: "bg-cyan-100 text-cyan-700",
};

const typeIcons: Record<ValidationTypeEnum, JSX.Element> = {
    scheme: <Layout className="w-4 h-4 " />,
    semantic: <FileText className="w-4 h-4" />,
    spelling: <SpellCheck className="w-4 h-4" />,
    resource: <Image className="w-4 h-4" />,
    structure: <AlertTriangle className="w-4 h-4" />,
};


export default function AnalysisIssues({
    analysisIssues,
    issuesCount,
}: {
    analysisIssues: Array<AnalysisIssue>;
    issuesCount: number;
}) {

    return (
        <div className="flex flex-1 flex-col  space-y-4">
            <div className="text-center">
                <h2 className="text-2xl font-semibold text-foreground mb-1">
                    {`Issues (${issuesCount})`}
                </h2>
            </div>

            {
                issuesCount > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {analysisIssues.map((issue) => (
                            <Card
                                key={issue.id}
                                shadow="sm"
                                className="hover:shadow-md transition-shadow border border-default-200"
                            >
                                <CardHeader className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <span className={clsx(
                                            typeColors[issue.type],
                                            "p-1 rounded-full"
                                        )}>
                                            {typeIcons[issue.type]}
                                        </span>
                                        <span className="font-medium capitalize">{issue.type}</span>
                                    </div>
                                    <Chip
                                        size="sm"
                                        className={`${typeColors[issue.type]} capitalize`}
                                    >
                                        {issue.tag}
                                    </Chip>
                                </CardHeader>
                                <CardBody className="text-sm text-default-700 space-y-2">
                                    <p>{issue.message}</p>
                                    <p className="text-xs text-gray-500 cursor-help">
                                        Elements with issue: {issue.traceIdCount}
                                    </p>
                                </CardBody>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center justify-center flex-1 ">
                        <p className="text-default-700 text-xl">
                            🎉 No issues detected — everything looks great!
                        </p>
                    </div>
                )
            }
        </div>
    );
}