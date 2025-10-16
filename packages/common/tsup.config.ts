import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/index.ts"],
    format: ["esm"],
    dts: true,
    clean: true,
    sourcemap: true,
    splitting: true,
    outDir: "dist",
    external: [
        "zod"
    ]
});