"use client"
import { Button } from "@heroui/button";
import { Checkbox } from "@heroui/checkbox";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/modal";
import { ValidationTypeEnum } from "@seo-analyzer/common";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import useCreateVirtualDomAnalysis from "../hooks/useCreateVirtualDomAnalysis.hook";

const validations = ["complete", "spelling"] as const

const allValidationsKeys = Object.keys(ValidationTypeEnum)

export default function CreateAnalysisModal({
    isOpen,
    onClose
}: {
    isOpen: boolean
    onClose: () => void
}) {
    const { virtualDomId, virtualWebId } = useParams()

    const { mutate, isPending } = useCreateVirtualDomAnalysis()

    const [selected, setSelected] = useState<"complete" | "spelling" | undefined>()

    const onCloseModal = () => {
        if (isPending) return
        onClose()
    }


    const onSubmit = () => {
        if (!selected) return
        /**
         * Complete abarca todo el las validaciones
         */
        mutate({
            id: Number(virtualDomId),
            virtualWebId: Number(virtualWebId),
            validationsSelected: selected === "complete" ?
                Object.fromEntries(allValidationsKeys.map((validation) => [validation.toLowerCase(), true])) :
                { ["spelling"]: true }
        })
    }

    useEffect(() => {
        if (!isOpen && selected) setSelected(undefined)
    }, [isOpen])

    return (
        <Modal
            isOpen={isOpen}
            onClose={onCloseModal}>
            <ModalContent>
                <ModalHeader className="text-2xl font-semibold">
                    Create a new analysis
                </ModalHeader>
                <ModalBody>
                    {validations.map((validation) => (
                        <Checkbox
                            isDisabled={isPending}
                            isSelected={selected === validation}
                            color="success"
                            onValueChange={(selected) => {
                                if (!selected) setSelected(undefined)
                                else setSelected(validation)
                            }}
                            key={validation}
                            value={validation}
                            className="capitalize">
                            {validation}
                        </Checkbox>
                    ))}
                </ModalBody>
                <ModalFooter className="w-full justify-between py-6">
                    <Button
                        onPress={onSubmit}
                        color="secondary"
                        isLoading={isPending}
                        variant="flat"
                        className=" px-8 font-medium">
                        Create
                    </Button>
                    <Button
                        onPress={onCloseModal}
                        color="danger"
                        isDisabled={isPending}
                        variant="flat"
                        className=" px-8 font-medium">
                        Cancel
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}