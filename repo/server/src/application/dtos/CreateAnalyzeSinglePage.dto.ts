import { ValidationsType } from "@/domain/virtual-dom/types/ValidationType.enum"

interface CreateAnalyzeSinglePageDto {
    path: string
    host: string
    validationsSelected: ValidationsType
}

export default CreateAnalyzeSinglePageDto