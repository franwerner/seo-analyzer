import express from "express";
import "./config/dotenv.config";
import corsConfig from "./config/cors.config";
import VirtualDomStore from "./services/VirtualDomStore.service";
import ErrorHandler from "./utils/errorHandler.utils";
import errorGlobal from "./middleware/errorGlobal.middleware";

const app = express()

const virtualDomStore = new VirtualDomStore()

app.use(corsConfig)
app.use(express.json())

app.get("/analyze", ErrorHandler.routeHandler(async (req, res) => {
    const url = req.query.url as string
    const virtualDom = virtualDomStore.getIfExist(url)
    const response = await virtualDom.validateAll()
    res.json(response)
}))

app.get("/calculate-token", ErrorHandler.routeHandler(async (req, res) => {
    const url = req.query.url as string
    const virtualDom = virtualDomStore.getIfExist(url)
    res.json({
        tokens: virtualDom.calculateTokens()
    })
}))

app.post("/create", ErrorHandler.routeHandler(
    async (req, res) => {
        const url = req.body.url as string
        const virtualDom = virtualDomStore.createOrGet(url)
        await virtualDom.start()
        res.status(201).json({ message: "VirtualDom created" })
    }))

app.use(errorGlobal)
app.listen(3000, () => console.log("ON"))