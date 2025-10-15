"use client"
import Container from "@/src/common/components/Container.component";
import RegisterVirtualWebModal from "@/src/features/virtualWeb/components/RegisterVirtualWebModal.component";
import VirtualWebList from "@/src/features/virtualWeb/components/VirtualWebList.component";
import { Button } from "@heroui/button";
import { useState } from "react";

const ModalContainer = () => {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <div className="self-end">
            <Button color="success" variant="flat" onPress={() => setIsOpen(true)}>Register a new web</Button>
            <RegisterVirtualWebModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </div>
    )
}

export default function VirtualWebListPage() {
    return (
        <Container as="main">
            <ModalContainer />
            <VirtualWebList />
        </Container>
    )
}