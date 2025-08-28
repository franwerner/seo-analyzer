import { useEffect, useRef, useState } from "preact/hooks";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

export type ResponseData<T extends object> = T & { message: string }

export type ResponseStatus = "idle" | "loading" | "success" | "failed"

export interface ResponseProps<T extends object> {
    data?: ResponseData<T>
    status: ResponseStatus
}

export type UseFetchReturn<T extends object> = ReturnType<typeof useFetch<T>>

type RequestInitExtends<T extends object> = {
    onSuccess?: (data: ResponseData<T>) => void
    onFailed?: (data: ResponseData<T>) => void
} & RequestInit

export default function useFetch<T extends object>() {

    const [response, setResponse] = useState<ResponseProps<T>>({
        status: "idle"
    })

    const ref = useRef({
        isMounting: true
    })

    const fetchData = async <U extends object = T>(url: string, {
        onSuccess,
        onFailed,
        ...rest
    }: RequestInitExtends<U> = {}) => {
        const completeUrl = `${BACKEND_URL}${url}`
        try {
            setResponse(prev => ({
                ...prev,
                status: "loading"
            }))
            const res = await fetch(completeUrl, { credentials: "include", ...rest })
            const contentType = res.headers.get("content-type")
            const isJson = contentType && contentType.includes("application/json")

            const data = isJson ? await res.json() : { message: "Algo salio mal" }
            if (!ref.current.isMounting) return
            if (onSuccess && res.ok) {
                onSuccess(data)
            } else if (onFailed && !res.ok) {

                onFailed(data)
            }
            setResponse({
                status: res.ok ? "success" : "failed",
                data
            })
        } catch (error) {
            const data: ResponseData<any> = {
                message: "Algo salio mal"
            }
            setResponse({
                status: "failed",
                data
            })
        }
    }

    useEffect(() => {
        return () => {
            ref.current.isMounting = false
        }
    }, [])

    return {
        response,
        fetchData
    }
}