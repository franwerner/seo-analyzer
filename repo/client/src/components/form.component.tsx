import useFetch from "../hooks/useFetch.hook"
import useForm from "../hooks/useForm.hook"
import Loading from "./loading.component"


export default function Form() {

  const {
    fetchData,
    response
  } = useFetch()

  const {
    status,
  } = response

  const {
    onChange,
    formData
  } = useForm()


  const handleSubmit = () => {
    fetchData("/analysis", {
      method: "POST",
      body: JSON.stringify(formData)
    })
  }

  return (
    <div className="min-h-screen bg-sky-50 flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md border border-sky-100">
        <h1 className="text-2xl font-bold text-sky-600 mb-6 text-center">Enviar Información</h1>
        <form className="space-y-5">
          <div>
            <label className="block text-sky-700 font-semibold mb-1" htmlFor="url">URL</label>
            <input
              name="url"
              placeholder="https://example.com"
              className="w-full border border-sky-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
              onChange={onChange}
            />
          </div>
          <div>
            <label className="block text-sky-700 font-semibold mb-1" htmlFor="description">Descripción (opcional)</label>
            <textarea
              name="description"
              rows={4}
              placeholder="Escribe una descripción relacionado a la pagina web..."
              className="w-full border border-sky-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
              onChange={onChange}
            ></textarea>
          </div>
          <button
            onClick={handleSubmit}
            type="button"
            className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
          >
            {status === "loading" ? <Loading /> : "Enviar"}
          </button>
        </form>
        {
          response.data?.message && response.status === "failed" &&
          <div className="bg-red-500 mt-2 p-2 font-semibold flex text-white rounded-md break-all min-h-16">
            <p className="m-auto">{response.data.message}</p>
          </div>
        }
      </div>
    </div>
  )
}