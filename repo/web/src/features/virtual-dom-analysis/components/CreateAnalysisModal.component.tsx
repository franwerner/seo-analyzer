"use client"
import { Button } from "@heroui/button";
import { Checkbox, CheckboxGroup } from "@heroui/checkbox";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/modal";
import { ValidationTypeEnum } from "@seo-analyzer/common";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import useCreateVirtualDomAnalysis from "../hooks/useCreateVirtualDomAnalysis.hook";

const validations = Object.values(ValidationTypeEnum)

export default function CreateAnalysisModal({
    isOpen,
    onClose
}: {
    isOpen: boolean
    onClose: () => void
}) {
    const { virtualDomId, virtualWebId } = useParams()

    const { mutate, isPending } = useCreateVirtualDomAnalysis()

    const [selected, setSelected] = useState<Array<ValidationTypeEnum>>([])

    const onCloseModal = () => {
        if (isPending) return
        onClose()
    }

    const onSubmit = () => {
        if (selected.length == 0) return
        mutate({
            id: Number(virtualDomId),
            virtualWebId: Number(virtualWebId),
            validationsSelected: Object.fromEntries(selected.map((validation) => [validation, true]))
        })
    }
    const onCheckboxChange = (value: Array<ValidationTypeEnum>) => {
        setSelected(value)
    }

    useEffect(() => {
        if (!isOpen && selected.length > 0) setSelected([])
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
                    <CheckboxGroup
                        color="success"
                        onChange={(value) => {
                            onCheckboxChange(value as Array<ValidationTypeEnum>)
                        }}
                        label="Select validations">
                        {validations.map((validation) => (
                            <Checkbox
                                isDisabled={isPending}
                                key={validation}
                                value={validation}
                                className="capitalize">
                                {validation}
                            </Checkbox>
                        ))}
                    </CheckboxGroup>
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