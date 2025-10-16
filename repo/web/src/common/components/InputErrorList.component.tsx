export default function InputErrorList({
    errors
}: {
    errors?: Array<string>
}) {
    if (!errors || errors.length === 0) return null
    return (
        <ul>
            {errors.map((error) => (
                <li key={error}>{error}</li>
            ))}
        </ul>
    )
}