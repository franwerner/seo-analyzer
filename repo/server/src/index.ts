import "./infrastructure/config/dotenv.config";
import cookieParser from "cookie-parser";
import express from "express";
import errorGlobal from "./http/middlewares/errorGlobal.middleware";
import corsConfig from "./infrastructure/config/cors.config";
import AppRoutes from "./http/routes";
import { virtualWebStore } from "./infrastructure/bootstrap";
import { webSummaryContext } from "./infrastructure/mocks/webSummaryContext.mock";


const v = virtualWebStore.createIfNotExists({
    host: "atticsexpress.com",
    pathname: "/",
    webSummary: {
        summary: webSummaryContext,
        generatedAt: new Date(),
        pathnameByGeneration: "/"
    }
})

v.vdomStore.getOrCreate("/")

const app = express()

app.use(corsConfig)
app.use(express.json())
app.use(cookieParser())
AppRoutes(app)

app.use(errorGlobal)
app.listen(3000, () => console.log("ON"))