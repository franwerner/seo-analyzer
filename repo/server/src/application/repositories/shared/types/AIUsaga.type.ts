import { AIUsage } from "@prisma/client";

export type AIUsageType = Omit<AIUsage, "id" | "input" | "output"> & { input: number, output: number }