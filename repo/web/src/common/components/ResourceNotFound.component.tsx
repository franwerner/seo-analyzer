export default function ResourceNotFound({ message }: { message?: string }) {
    return (
        <div className="flex justify-center h-full items-center flex-1">
            <p className="text-xl font-medium text-center text-danger-500 bg-danger-50 p-3 rounded-lg uppercase">{message}</p>
        </div>
    )
}