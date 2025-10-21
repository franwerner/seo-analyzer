"use client"
import Container from "@/src/common/components/Container.component";
import Loader from "@/src/common/components/Loader.component";
import ResourceNotFound from "@/src/common/components/ResourceNotFound.component";
import ShowMoreButton from "@/src/common/components/ShowMoreButton.component";
import { Button } from "@heroui/button";
import { useState } from "react";
import RegisterVirtualWebModal from "../components/RegisterVirtualWebModal.component";
import VirtualWebCard from "../components/VirtualWebCard.component";
import useGetVirtualWebs from "../hooks/useGetWebs.hook";



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

    const { data, isPending, fetchNextPage, hasNextPage, error, isError } = useGetVirtualWebs()

    if (isPending) return <Loader />
    else if (isError) throw error

    const webs = data.pages.flatMap(i => i.result.virtualWebs)

    return (
        <Container as="main">
            <ModalContainer />
            <div className="w-full flex-1 flex flex-col h-full p-6 gap-8 rounded-lg ">
                <div>
                    <h2 className="text-3xl font-semibold text-default-800  text-center uppercase">Virtual Web List</h2>
                </div>
                <div className="flex h-full flex-col flex-1 justify-start items-center w-full gap-8">
                    {
                        webs.length === 0 ? (
                            <ResourceNotFound message="No virtual webs available" />
                        ) : (
                            <ul className="space-y-4 w-full  gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" >
                                {
                                    webs.map((web) => (
                                        <VirtualWebCard key={web.id} web={web} />
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