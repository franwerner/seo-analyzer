import cors from "cors"

console.log(process.env.CLIENT_URL)
const corsConfig = cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
})

export default corsConfig