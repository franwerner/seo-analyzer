import LoginForm from "@/src/features/auth/components/LoginForm.component";
import Container from "@/src/common/components/Container.component";


export default function LoginPage() {
    return (
        <Container className="justify-center items-center">
            <LoginForm />
        </Container>
    )
}