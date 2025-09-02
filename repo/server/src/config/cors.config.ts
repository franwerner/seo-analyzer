import cors from "cors"

const corsConfig = cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
})

export default corsConfig