import { ValidationsType } from "@/domain/virtual-dom/types/ValidationType.enum"

interface CreateAnalyzeDomDto {
    path: string
    pageSummary: string
    validationsSelected: ValidationsType
}

export default CreateAnalyzeDomDto