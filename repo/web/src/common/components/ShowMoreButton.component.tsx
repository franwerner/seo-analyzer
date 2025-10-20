"use client"
import { Button } from "@heroui/button";

export default function ShowMoreButton({
    fetchNextPage,
    isLoading,
    hasNextPage
}: {
    fetchNextPage: () => void,
    isLoading: boolean,
    hasNextPage: boolean
}) {
    if (!hasNextPage) return null
    return (
        <Button
            onPress={() => fetchNextPage()}
            color="default"
            size="lg"
            isLoading={isLoading}
            variant="solid"
            className="bg-default-900 text-white"
        >
            Show more
        </Button>
    )
}