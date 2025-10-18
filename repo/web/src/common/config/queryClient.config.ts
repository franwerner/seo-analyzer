import { addToast } from "@heroui/toast";
import { ApiResponseFailed } from "@seo-analyzer/common";
import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";

const onError = (error: Error) => {
    if (error instanceof ApiResponseFailed) {
        addToast({
            title: "Error",
            description: error.message,
            color: "danger",
            severity: "danger"
        })
    } else {
        addToast({
            title: "Error",
            description: "Unexpected error",
            color: "danger",
            severity: "danger"
        })
    }
}

export default function queryClientConfig() {
    return new QueryClient({
        queryCache: new QueryCache({
            onError(error) {
                onError(error)
            },
        }),
        mutationCache: new MutationCache({
            onError(error) {
                onError(error)
            },
        }),
    });
}