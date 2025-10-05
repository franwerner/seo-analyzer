import { useRouter } from "preact-router"
import Loading from "@/components/loading.component"
import useFetch from "@/hooks/useFetch.hook"
import useForm from "@/hooks/useForm.hook"


export default function RegisterUrl() {

  const [_, nav] = useRouter()
  const { fetchData, response } = useFetch()
  const { onChange, formData } = useForm({
    domain: "",
    path: ""
  })

  const { status } = response

  const handleSubmit = (e: Event) => {
    e.preventDefault()
    fetchData(`/create`, {
      body: JSON.stringify({
        domain: formData.domain,
        path: formData.path,
      }),
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      onSuccess() {
        nav(`/analyze?domain=${formData.domain}&path=${formData.path}&path=${formData.path}`)
      },
    })
  }

  return (
    <div className="min-h-screen bg-sky-50 flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md border border-sky-100">
        <h1 className="text-2xl font-bold text-sky-600 mb-6 text-center">Enviar Información</h1>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sky-700 font-semibold mb-1" htmlFor="domain">Dominio</label>
            <input
              name="domain"
              value={formData.domain}
              placeholder="example.com"
              className="w-full border border-sky-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
              onChange={onChange}
            />
          </div>
          <div>
            <label className="block text-sky-700 font-semibold mb-1" htmlFor="path">Ruta principal</label>
            <input
              name="path"
              value={formData.path}
              placeholder="Coloca una ruta principal o deja vacio"
              className="w-full border border-sky-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
              onChange={onChange}
            />
          </div>
          <button
            disabled={status === "loading"}
            onClick={handleSubmit}
            type="button"
            className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
          >
            {status === "loading" ? <Loading /> : "Enviar análisis"}
          </button>
        </form>

        {response.data?.message && response.status === "failed" &&
          <div className="bg-red-500 mt-2 p-2 font-semibold flex text-white rounded-md break-all min-h-16">
            <p className="m-auto">{response.data.message}</p>
          </div>
        }
      </div>
    </div>
  )
}