interface Issue {
    message: string;
    tag: string;
    traceIds: string[];
    type: "schema" | "semantic" | "spelling" | "general" | "resource" | "structure";
}

export type { Issue }