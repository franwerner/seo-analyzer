"use client"
import { useEffect } from "react";


export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 gap-4">
      <div className="bg-danger-50 text-danger-600 px-4 py-3 rounded-md shadow-sm text-center">
        <p className="font-medium text-xl">An unexpected error occurred!</p>
        {error.message && <p className="text-md mt-1">{error.message}</p>}
      </div>
    </div>
  )
}