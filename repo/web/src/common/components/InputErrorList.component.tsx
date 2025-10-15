export default function InputErrorList({
    errors
}: {
    errors: Array<string>
}) {
    return (
        <ul>
            {errors.map((error) => (
                <li key={error}>{error}</li>
            ))}
        </ul>
    )
}