import ValidationType from "@/domain/virtual-dom/types/ValidationType.interface"

interface CreateAnalyzeDomDto {
    path: string
    pageSummary: string
    validationTypes: Array<ValidationType>
}

export default CreateAnalyzeDomDto