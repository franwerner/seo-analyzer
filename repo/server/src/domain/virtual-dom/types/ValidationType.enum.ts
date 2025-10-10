enum ValidationType {
    SCHEME = "scheme",
    SEMANTIC = "semantic",
    SPELLING = "spelling",
    RESOURCE = "resource",
    STRUCTURE = "structure"
}

export type ValidationsType = Partial<Record<ValidationType, boolean>>

export default ValidationType