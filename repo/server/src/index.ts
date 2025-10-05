import "./infrastructure/config/dotenv.config";
import cookieParser from "cookie-parser";
import express from "express";
import errorGlobal from "./api/middlewares/errorGlobal.middleware";
import corsConfig from "./infrastructure/config/cors.config";
import AppRoutes from "./api/routes";

const app = express()

AppRoutes(app)
app.use(corsConfig)
app.use(express.json())
app.use(cookieParser())


app.use(errorGlobal)
app.listen(3000, () => console.log("ON"))