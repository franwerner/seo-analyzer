import ValidationType from "@/domain/virtual-dom/types/ValidationType.interface"

interface CreateAnalyzeSinglePageDto {
    path: string
    host: string
    validationTypes: Array<ValidationType>
}

export default CreateAnalyzeSinglePageDto