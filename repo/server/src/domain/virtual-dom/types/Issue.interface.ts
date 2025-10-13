import ValidationType from "./ValidationType.enum"

export interface Issue {
    message: string
    tag: string
    traceIds: Array<string>
    type: ValidationType
}
