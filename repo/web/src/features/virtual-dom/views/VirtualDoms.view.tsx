"use client"
import Container from "@/src/common/components/Container.component"
import Loader from "@/src/common/components/Loader.component"
import ResourceNotFound from "@/src/common/components/ResourceNotFound.component"
import ShowMoreButton from "@/src/common/components/ShowMoreButton.component"
import { Button } from "@heroui/button"
import { VirtualDom } from "@seo-analyzer/common"
import Link from "next/link"
import { useParams } from "next/navigation"
import { memo, useState } from "react"
import RegisterVirtualDom from "../components/RegisterVirtualDomModal.component"
import useGetVirtualDoms from "../hooks/useGetVirtualDoms.hook"


const ModalContainer = () => {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <div className="flex justify-center   md:justify-end">
            <Button
                color="success"
                className="font-medium max-w-min "
                variant="flat"
                onPress={() => setIsOpen(true)}>Register a new virtual dom</Button>
            <RegisterVirtualDom isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </div>
    )
}

const VirtualDomItem = memo(({ dom }: { dom: VirtualDom }) => {
    const { virtualWebId } = useParams()
    return (
        <li
            key={dom.id}
            className="flex justify-between py-6  hover:scale-100 w-full h-full border border-b-2 border-default-300 items-center scale-95   rounded-lg px-4 shadow-sm transition-all"
        >
            <div className="flex gap-1 overflow-hidden flex-col">
                <span className="text-md text-gray-500">
                    Pathname: {dom.pathname}
                </span>
            </div>
            <Link href={`/virtualWeb/${virtualWebId}/virtualDom/${dom.id}`}>
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


export default function VirtualDomsView() {

    const { virtualWebId } = useParams()

    const { data, isPending, fetchNextPage, hasNextPage, error, isError } = useGetVirtualDoms(Number(virtualWebId))

    if (isPending) return <Loader />
    else if (isError) throw error

    const doms = data.pages.flatMap(i => i.result.virtualDoms)

    return (
        <Container as="main">
            <ModalContainer />
            <div className="w-full flex-1 flex flex-col h-full p-6 gap-8 rounded-lg ">
                <h1 className="text-3xl font-semibold text-default-800  text-center uppercase ">Virtual Dom List</h1>
                <div className="flex h-full flex-col flex-1 justify-start items-center w-full gap-8">
                    {
                        doms.length === 0 ? (
                            <ResourceNotFound message="No virtual doms available" />
                        ) : (
                            <ul className="space-y-4 w-full  gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" >
                                {
                                    doms.map((dom) => (
                                        <VirtualDomItem key={dom.id} dom={dom} />
                                    ))
                                }
                            </ul>
                        )
                    }
                    <ShowMoreButton
                        fetchNextPage={fetchNextPage}
                        isLoading={isPending}
                        hasNextPage={hasNextPage}
                    />
                </div>
            </div >
        </Container>
    )
}