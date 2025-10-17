"use client"
import Container from "@/src/common/components/Container.component";
import { Button } from "@heroui/button";
import { Link as HLink } from "@heroui/link";
import { Spinner } from "@heroui/spinner";
import { usageScheme, VirtualWeb } from "@seo-analyzer/common";
import Link from "next/link";
import { memo, useState } from "react";
import RegisterVirtualWebModal from "./components/RegisterVirtualWebModal.component";
import useGetVirtualWebs from "./hooks/useGetWebs.hook";

const VirtualWebItem = memo(({ web }: { web: VirtualWeb }) => {
    return (
        <li
            key={web.id}
            className="flex justify-between  hover:scale-100 w-full h-full border border-b-2 border-default-300 items-center scale-95   rounded-lg py-1 px-4 shadow-sm transition-all"
        >
            <div className="flex gap-1 overflow-hidden flex-col">
                <HLink
                    color="foreground"
                    showAnchorIcon
                    underline="hover"
                    isExternal
                    href={`http://${web.host}`}
                    className="text-lg truncate uppercase font-semibold "
                >
                    {web.host}
                </HLink>
                <span className="text-sm text-gray-500">
                    Main Pathname: {web.virtualWebConfig.virtualDom.pathname}
                </span>
                <span className="text-sm text-gray-600">
                    It has {web.virtualDomCount} Virtual dom
                </span>
            </div>

            <Link href={`/virtualWeb/${web.id}`}>
                <Button
                    color="secondary"
                    size="sm"
                    className="text-sm font-medium"
                    variant="flat"
                >
                    Go to panel
                </Button>
            </Link>
        </li>
    )
})

const ModalContainer = () => {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <div className="self-end">
            <Button
                color="success"
                className="font-medium"
                variant="flat"
                onPress={() => setIsOpen(true)}>Register a new virtual web</Button>
            <RegisterVirtualWebModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </div>
    )
}

export default function VirtualWebsView() {

    const { data, isLoading, fetchNextPage, hasNextPage } = useGetVirtualWebs()

    const dat = data?.pages || []

    const webs = dat.flatMap(i => i.result?.virtualWebs || [])

    return (
        <Container as="main">
            <ModalContainer />
            <div className="w-full flex-1 flex flex-col h-full p-6 gap-8 rounded-lg ">
                <div>
                    <h2 className="text-3xl font-semibold text-default-900  text-center uppercase ">Virtual Web List</h2>
                </div>
                {
                    isLoading ?
                        <div className="flex justify-center h-full items-center flex-1">
                            <Spinner size="lg" />
                        </div> :
                        <div className="flex h-full flex-col flex-1 justify-start items-center w-full gap-8">
                            <ul className="space-y-4 w-full  gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" >
                                {
                                    webs.map((web) => (
                                        <VirtualWebItem key={web.id} web={web} />
                                    ))
                                }
                            </ul>
                            {
                                hasNextPage && (
                                    <Button
                                        onPress={() => fetchNextPage()}
                                        color="default"
                                        size="lg"
                                        isLoading={isLoading}
                                        variant="solid"
                                        className="bg-default-900 text-white"
                                    >
                                        Show more
                                    </Button>
                                )
                            }
                        </div>
                }
            </div >
        </Container>
    )
}