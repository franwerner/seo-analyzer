"use client"
import InputErrorList from "@/src/common/components/InputErrorList.component"
import normalizeFormData, { NormalizedFormDataType } from "@/src/common/utils/normalizedFormData.util"
import { Button } from "@heroui/button"
import { Form } from "@heroui/form"
import { Input } from "@heroui/input"
import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/modal"
import { CreateVirtualWebDTO, createVirtualWebScheme } from "@seo-analyzer/common"
import { useState } from "react"
import useCreateVirtualWeb from "../hooks/useCreateVirtualWeb.hook"


interface RegisterWebModalProps {
    isOpen: boolean,
    onClose: () => void
}


const ModalForm = ({
    onClose
}: {
    onClose: () => void
}) => {

    const { mutateAsync, isPending } = useCreateVirtualWeb()

    const [errors, setErrors] = useState<Partial<Record<keyof CreateVirtualWebDTO, string[]>>>({
        host: undefined,
        mainPathname: undefined
    })

    const handleSubmit = (form: NormalizedFormDataType) => {

        const res = createVirtualWebScheme.safeParse(form)
        if (!res.success) {
            const fieldErrors = res.error.flatten().fieldErrors
            setErrors(fieldErrors)
            return
        }
        mutateAsync({
            host: form.host,
            mainPathname: form.mainPathname
        }).then(() => {
            onClose()
        })
    }


    return (
        <Form
            validationBehavior="aria"
            onSubmit={(e) => {
                e.preventDefault()
                handleSubmit(normalizeFormData(e))
            }}>
            <div className="space-y-4 w-full">
                <Input
                    name="host"
                    label="Enter host URL (e.g. example.com)"
                    color="default"
                    isInvalid={!!errors.host}
                    errorMessage={() => <InputErrorList errors={errors.host} />}
                    className="w-full"
                />
                <Input
                    name="mainPathname"
                    color="default"
                    label="Enter main pathname (e.g. /about or /)"
                    isInvalid={!!errors.mainPathname}
                    defaultValue="/"
                    errorMessage={() => <InputErrorList errors={errors.mainPathname} />}
                    className="w-full"
                />
            </div>
            <div className="p-6 flex w-full justify-between">
                <Button
                    type="submit"
                    className=" px-8 font-medium"
                    isLoading={isPending}
                    variant="flat"
                    color="success" >
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

export default function RegisterVirtualWebModal({
    isOpen,
    onClose
}: RegisterWebModalProps) {

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}>
            <ModalContent>
                <ModalHeader className="pt-6">
                    <h2 className="text-2xl font-semibold mb-4">Register Virtual Web</h2>
                </ModalHeader>
                <ModalBody>
                    <ModalForm onClose={onClose} />
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}