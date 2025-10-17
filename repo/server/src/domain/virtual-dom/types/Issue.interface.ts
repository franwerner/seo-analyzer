import { ValidationTypeEnum } from "@packages/common"

export interface Issue {
    message: string
    tag: string
    traceIds: Array<string>
    type: ValidationTypeEnum
}
