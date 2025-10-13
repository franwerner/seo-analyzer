import "./infrastructure/config/dotenv.config";
import cookieParser from "cookie-parser";
import express from "express";
import errorGlobal from "./http/middlewares/errorGlobal.middleware";
import corsConfig from "./infrastructure/config/cors.config";
import AppRoutes from "./http/routes";

const app = express()

app.use(corsConfig)
app.use(express.json())
app.use(cookieParser())
AppRoutes(app)

app.use(errorGlobal)
app.listen(3000, () => console.log("ON"))