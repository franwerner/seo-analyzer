import { ValidationTypeEnum } from "@seo-analyzer/common"

export interface Issue {
    message: string
    tag: string
    traceIds: Array<string>
    type: ValidationTypeEnum
}
