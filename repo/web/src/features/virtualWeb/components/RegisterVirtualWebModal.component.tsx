"use client"
import InputErrorList from "@/src/common/components/InputErrorList.component"
import normalizeFormData, { NormalizedFormDataType } from "@/src/common/utils/normalizedFormData.util"
import { Button } from "@heroui/button"
import { Form } from "@heroui/form"
import { Input } from "@heroui/input"
import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/modal"
import { useState } from "react"
import useRegisterVirtualWeb from "../hooks/useRegisterVirtualWeb.hook"

interface RegisterWebModalProps {
    isOpen: boolean,
    onClose: () => void
}


export default function RegisterVirtualWebModal({
    isOpen,
    onClose
}: RegisterWebModalProps) {

    const { mutateAsync, isPending } = useRegisterVirtualWeb()

    const [hostError, setHostError] = useState<Record<string, Array<string>>>({
        host: [],
        mainPathname: []
    })

    const handleSubmit = (form: NormalizedFormDataType) => {


        mutateAsync({
            host: form.host,
            mainPathname: form.mainPathname
        }).then(() => {
            onClose()
        })
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}>
            <ModalContent>
                <ModalHeader className="pt-6">
                    <h2 className="text-2xl font-semibold mb-4">Register Web</h2>
                </ModalHeader>
                <ModalBody>
                    <Form
                        validationErrors={{
                            host: "asdad"
                        }}
                        onSubmit={(e) => {
                            e.preventDefault()
                            handleSubmit(normalizeFormData(e))
                        }}>
                        <div className="space-y-4 w-full">
                            <Input
                                name="host"
                                errorMessage={() => <InputErrorList errors={hostError.host} />}
                                color="default"
                                placeholder="Enter host URL"
                                className="w-full"
                            />
                            <Input
                                name="mainPathname"
                                color="default"
                                errorMessage={() => <InputErrorList errors={hostError.mainPathname} />}
                                placeholder="Enter main pathname"
                                className="w-full"
                            />
                        </div>
                        <div className="p-6 flex w-full justify-between">
                            <Button
                                type="submit"
                                className="bg-default-900 px-8 font-bold text-white"
                                isLoading={isPending}
                                color="default" >
                                Register
                            </Button>
                            <Button
                                onPress={onClose}
                                color="danger"
                                variant="flat"
                                isDisabled={isPending}
                                className=" px-8  font-bold"  >
                                Cancel
                            </Button>
                        </div>
                    </Form>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}