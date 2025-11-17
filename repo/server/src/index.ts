import "./infrastructure/config/dotenv.config";
import cookieParser from "cookie-parser";
import express from "express";
import errorGlobal from "./http/middlewares/errorGlobal.middleware";
import AppRoutes from "./http/routes";
import getEnsureEnv from "./infrastructure/utils/getEnsureEnv.utils";
const app = express()

app.use(express.json())
app.use(cookieParser())
AppRoutes(app)
app.use(errorGlobal)
app.listen(getEnsureEnv("PORT"), () => console.log("ON"))