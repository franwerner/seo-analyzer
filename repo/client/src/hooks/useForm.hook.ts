import { useState } from "preact/hooks"

export default function useForm<T extends object>(props: T) {

    const [formData, setFormData] = useState(props)

    const onChange = (e: Event) => {
        const target = e.target as HTMLInputElement
        const { name, value } = target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }


    return {
        formData,
        onChange,
    }
}