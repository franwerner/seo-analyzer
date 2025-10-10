import z from "zod"

const traceIdsSchema = z.object({
    traceIds: z.array(z.string())
})

export default traceIdsSchema