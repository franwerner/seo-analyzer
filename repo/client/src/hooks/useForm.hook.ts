import { useState } from "preact/hooks"

export default function useForm() {

    const [formData, setFormData] = useState({})

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