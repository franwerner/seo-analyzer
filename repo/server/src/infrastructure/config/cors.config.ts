import getEnsureEnv from "@/shared/utils/getEnsureEnv.utils"
import cors from "cors"

const corsConfig = cors({
    origin: getEnsureEnv("CLIENT_URL"),
    credentials: true,
})

export default corsConfig