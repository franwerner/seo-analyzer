"use client"
import normalizeFormData, { NormalizedFormDataType } from "@/src/common/utils/normalizedFormData.util";
import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import useLogin from "../hooks/useLogin.hook";



export default function LoginForm() {

    const { isPending, mutate } = useLogin()

    function handleSubmit(form: NormalizedFormDataType) {
        mutate(form.password)
    }

    return (
        <Card className="w-full max-w-md p-6 shadow-xl rounded-2xl  border border-primary-100 backdrop-blur-sm">
            <CardHeader className="flex justify-center pb-2">
                <h2 className="text-3xl font-bold text-primary-500  text-center tracking-tight">Welcome!</h2>
            </CardHeader>
            <Form onSubmit={(e) => {
                e.preventDefault()
                handleSubmit(normalizeFormData(e))
            }}>
                <CardBody className="space-y-6 mt-4">
                    <Input
                        name="password"
                        id="password"
                        type="password"
                        variant="flat"
                        placeholder="Password"
                        color="primary"
                        disabled={isPending}
                        isRequired
                        className="w-full"
                    />
                </CardBody>
                <CardFooter className="flex flex-col gap-4 mt-2">
                    <Button
                        type="submit"
                        color="primary"
                        className="w-full"
                        size="lg"
                        isLoading={isPending}
                        variant="solid"
                    >
                        Log In
                    </Button>
                </CardFooter>
            </Form>
        </Card>
    )
}