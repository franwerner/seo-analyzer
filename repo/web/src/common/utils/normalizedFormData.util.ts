
function isStringEntry(
    entry: [string, FormDataEntryValue]
): entry is [string, string] {
    return typeof entry[1] === "string";
}

export default function normalizeFormData(e: React.FormEvent<HTMLFormElement>) {
    const formData = new FormData(e.target as HTMLFormElement)
    const onlyStringValues = formData.entries().filter(isStringEntry)
    const data = Object.fromEntries(onlyStringValues)
    return data
}

export type NormalizedFormDataType = ReturnType<typeof normalizeFormData>
