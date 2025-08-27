import { useRouter } from "preact-router"
import useFetch from "@/hooks/useFetch.hook"
import { useEffect } from "preact/hooks"
import Loading from "@/components/loading.component"
import calcCostInputToken from "../services/calcCostInputToken.service"

export default function TokenModal({ onConfirm }: { onConfirm: () => void }) {

  const [{ matches }] = useRouter()

  const {
    fetchData,
    response
  } = useFetch<{ tokens: number }>()

  useEffect(() => {
    fetchData(`/calculate-token?url=${matches?.url}`)
  }, [])

  return <div className="w-full fixed h-full z-50 flex justify-center items-center bg-black/20 backdrop-blur-sm">
    <div className="max-w-md w-full shadow-2xl bg-white border-sky-100 rounded-xl p-6 border animate-fade-in">
      <h2 className="text-2xl font-bold text-sky-700 mb-4">Confirmar análisis SEO</h2>

      <div className="space-y-4 text-sm text-gray-800 min-h-[100px] flex flex-col justify-center">

        {response.status === "loading" &&
          <div className="flex justify-center items-center h-24">
            <Loading text="Calculando tokens..." />
          </div>
        }

        {response.status === "failed" &&
          <div className="text-center bg-red-500 rounded-md flex items-center justify-center h-24 text-white">
            <p className="font-semibold">{response.data?.message}</p>
          </div>
        }

        {response.status === "success" && response.data && (
          <>
            <p>Estás a punto de realizar un análisis SEO que implicará un costo en tokens.</p>

            <div className="bg-sky-50 border border-sky-200 rounded-md p-4 text-sm">
              <div className="flex justify-between">
                <span className="font-medium text-sky-700">Tokens de entrada:</span>
                <span className="font-semibold">{response.data.tokens}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="font-medium text-sky-700">Costo estimado:</span>
                <span className="font-semibold text-emerald-600">
                  {calcCostInputToken(response.data.tokens)}
                </span>
              </div>
            </div>

            <p className="text-gray-600 pt-2">
              ¿Deseas continuar con la ejecución del análisis?
            </p>

            <div className="flex justify-center gap-3 mt-6">
              <button
                type="submit"
                onClick={onConfirm}
                className="px-4 py-2 rounded-md bg-sky-600 hover:bg-sky-700 text-white font-medium transition"
              >
                Deseo continuar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  </div>
}