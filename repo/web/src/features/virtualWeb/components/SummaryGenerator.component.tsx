"use client"
import { Button } from "@heroui/button";
import { useState } from "react";

export default function SummaryGenerator() {
    const [summary, setSummary] = useState<string | null>();

    return (
        <div className="h-full border flex flex-col overflow-y-auto gap-4 border-default-200 shadow rounded-xl p-5">
            <h3 className="font-semibold text-2xl text-default-900">
                Web Summary
            </h3>

            {summary ? (
                <p className="text-default-700">{summary}</p>
            ) : (
                <div className="flex flex-col gap-6 flex-1 justify-center  items-center ">
                    <p className="text-default-500 italic text-center">
                        No summary available. Please generate one.
                    </p>
                    <Button
                        color="default"
                        variant="flat"
                        className="bg-default-900 py-8 px-8 text-white"
                    >
                        Generate Summary
                    </Button>
                </div>
            )}
        </div>
    );
}