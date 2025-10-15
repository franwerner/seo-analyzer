"use client"
import { Button } from "@heroui/button";
import Link from "next/link";
import useGetVirtualWebs from "../hooks/useGetWebs.hook";
import { VirtualWeb } from "../types/VirtualWeb.type";
import { Spinner } from "@heroui/spinner";

const List = ({ webs }: { webs: VirtualWeb[] }) => {
    return (
        <ul className="space-y-4 w-full  gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" >
            {
                webs.map((web) => (
                    <li
                        key={web.id}
                        className="flex justify-between hover:scale-100 w-full border border-b-2 border-default-300 items-center scale-95   rounded-lg px-4 py-3 shadow-sm transition-all"
                    >
                        <div className="flex flex-col">
                            <a
                                href={`http://${web.host}${web.virtualWebConfig.virtualDom.pathname}`}
                                target="_blank"
                                className="text-lg font-medium text-primary-600 hover:underline"
                            >
                                {web.host}
                            </a>
                            <span className="text-sm text-gray-500">
                                Main Pathname: {web.virtualWebConfig.virtualDom.pathname}
                            </span>
                            <span className="text-sm text-gray-600">
                                It has {web.virtualDomCount} Virtual page
                            </span>
                        </div>

                        <Link href={`virtualWeb/${web.id}`}>
                            <Button
                                color="default"
                                size="sm"
                                className="bg-default-900 text-white"
                                variant="solid"
                            >
                                Go to panel
                            </Button>
                        </Link>
                    </li>
                ))
            }
        </ul>
    )
}

export default function WebList() {

    const { data, isLoading, } = useGetVirtualWebs()

    const webs = data?.result || []

    return (
        <div className="w-full flex-1 flex flex-col h-full p-6 gap-4 rounded-lg ">
            <h2 className="text-3xl font-semibold text-default-800 underline text-center uppercase ">Web Hosts List</h2>
            {
                isLoading ?
                    <div className="flex justify-center h-full items-center flex-1">
                        <Spinner size="lg" />
                    </div> :
                    <div className="flex h-full flex-col flex-1 justify-center items-center w-full gap-8">
                        <List webs={webs} />
                        <Button
                            color="default"
                            size="lg"
                            variant="solid"
                            className="bg-default-900 text-white"
                        >
                            Show more
                        </Button>
                    </div>
            }
        </div >
    )
}