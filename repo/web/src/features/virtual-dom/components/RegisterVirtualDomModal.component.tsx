"use client"
import { Form } from "@heroui/form";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/modal";
import useCreateVirtualDom from "../hooks/useCreateVirtualDom.hook";
import { Input } from "@heroui/input";
import { useState } from "react";
import { createVirtualDomScheme } from "@seo-analyzer/common";
import normalizeFormData, { NormalizedFormDataType } from "@/src/common/utils/normalizedFormData.util";
import InputErrorList from "@/src/common/components/InputErrorList.component";
import { useParams } from "next/navigation";
import { Button } from "@heroui/button";

interface RegisterVirtualDomProps {
    isOpen: boolean;
    onClose: () => void;
}


const ModalForm = ({ onClose }: { onClose: () => void }) => {

    const { mutateAsync, isPending } = useCreateVirtualDom()

    const { virtualWebId } = useParams()

    const [errors, setErrors] = useState<string[] | undefined>()

    const handleSubmit = (form: NormalizedFormDataType) => {
        const res = createVirtualDomScheme.safeParse({
            pathname: form.pathname,
            virtualWebId: Number(virtualWebId)
        })
        if (!res.success) {
            const fieldErrors = res.error.flatten().fieldErrors
            setErrors(fieldErrors.pathname)
            return
        }
        mutateAsync(res.data).then(() => {
            onClose()
        })
    }


    return (
        <Form
            validationBehavior="aria"
            onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault()
                handleSubmit(normalizeFormData(e))
            }}>
            <Input
                name="pathname"
                label="Enter pathname (e.g. /about or /)"
                defaultValue="/"
                color="default"
                isInvalid={!!errors}
                errorMessage={() => <InputErrorList errors={errors} />}
                className="w-full"
            />
            <div className="p-6 flex w-full justify-between">
                <Button
                    type="submit"
                    className=" px-8 font-medium"
                    isLoading={isPending}
                    variant="flat"
                    color="secondary" >
                    Register
                </Button>
                <Button
                    onPress={onClose}
                    color="danger"
                    variant="flat"
                    isDisabled={isPending}
                    className=" px-8  font-medium"  >
                    Cancel
                </Button>
            </div>
        </Form>
    )

}


export default function RegisterVirtualDom({
    isOpen,
    onClose
}: RegisterVirtualDomProps) {
    return (

        <Modal
            isOpen={isOpen}
            onClose={onClose}>
            <ModalContent>
                <ModalHeader className="pt-6">
                    <h2 className="text-2xl font-semibold mb-4">Register Virtual Dom</h2>
                </ModalHeader>
                <ModalBody>
                    <ModalForm onClose={onClose} />
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}