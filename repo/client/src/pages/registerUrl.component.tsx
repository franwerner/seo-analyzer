import { useRouter } from "preact-router"
import Loading from "@/components/loading.component"
import useFetch from "@/hooks/useFetch.hook"
import useForm from "@/hooks/useForm.hook"


export default function RegisterUrl() {

  const [_, nav] = useRouter()
  const { fetchData, response } = useFetch()
  const { onChange, formData } = useForm({
    url: "",
    exhaustive: false,
  })

  const { status } = response

  const handleSubmit = (e: Event) => {
    e.preventDefault()
    fetchData(`/create`, {
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      onSuccess() {
        nav(`/analyze?url=${formData.url}`)
      },
    })
  }

  return (
    <div className="min-h-screen bg-sky-50 flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md border border-sky-100">
        <h1 className="text-2xl font-bold text-sky-600 mb-6 text-center">Enviar Información</h1>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sky-700 font-semibold mb-1" htmlFor="url">URL</label>
            <input
              name="url"
              value={formData.url}
              placeholder="https://example.com"
              className="w-full border border-sky-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
              onChange={onChange}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="exhaustive"
              id="exhaustive"
              checked={formData.exhaustive}
              onChange={(e) => {
                const target = e.target as HTMLInputElement
                onChange({ target: { name: "exhaustive", value: target.checked } })
              }}
              className="w-4 h-4 text-sky-500 border-sky-300 rounded focus:ring-2 focus:ring-sky-400"
            />
            <label htmlFor="exhaustive" className=" font-semibold select-none">
              Análisis exhaustivo
            </label>
          </div>

          <button
            disabled={status === "loading"}
            onClick={handleSubmit}
            type="button"
            className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
          >
            {status === "loading" ? <Loading /> : formData.exhaustive ? "Enviar análisis exhaustivo" : "Enviar análisis"}
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