export enum ValidationTypeEnum {
    SCHEME = "scheme",
    SEMANTIC = "semantic",
    SPELLING = "spelling",
    RESOURCE = "resource",
    STRUCTURE = "structure"
}

export type ValidationsType = Partial<Record<ValidationTypeEnum, boolean>>
