import useFetch from "@/hooks/useFetch.hook"
import useForm from "@/hooks/useForm.hook"
import { useRouter } from "preact-router"

export default function LoginPage() {

    const [_, nav] = useRouter()

    const {
        response,
        fetchData
    } = useFetch()

    const {
        status,
        data
    } = response

    const {
        formData,
        onChange
    } = useForm({
        password: ""
    })

    const login = (e: Event) => {
        e.preventDefault()
        fetchData("/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                password: formData.password
            }),
            onSuccess() {
                nav("/")
            },
        })

    }


    return (
        <div className="min-h-screen bg-sky-50 flex items-center justify-center px-4">
            <form className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm space-y-4 border border-sky-200" onSubmit={login}>
                <h2 className="text-xl font-semibold text-sky-700 text-center">Acceso</h2>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={onChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400"
                        required
                    />
                </div>

                {status === 'failed' && (
                    <div className="text-red-600 text-sm text-center font-medium">
                        {data?.message}
                    </div>
                )}

                <button
                    type="submit"
                    onClick={login}
                    className="w-full bg-sky-600 text-white py-2 rounded-md font-semibold hover:bg-sky-700 transition"
                    disabled={status === 'loading'}
                >
                    {status === 'loading' ? 'Verificando...' : 'Ingresar'}
                </button>
            </form>
        </div>
    )
}