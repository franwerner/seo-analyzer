import cookieParser from "cookie-parser";
import express from "express";
import "./config/dotenv.config";
import corsConfig from "./config/cors.config";
import authMiddleware from "./middleware/auth.middleware";
import errorGlobal from "./middleware/errorGlobal.middleware";
import AuthService from "./services/auth.service";
import ErrorHandler from "./utils/errorHandler.utils";
import getEnsureEnv from "./utils/getEnsureEnv.utils";
import VirtualWebStore from "./domain/virtual-web/store/virtualWeb.store";

const app = express()

const virtualWebStore = new VirtualWebStore()

app.use(corsConfig)
app.use(express.json())
app.use(cookieParser())

app.post("/login", ErrorHandler.routeHandler((req, res) => {

    const password = req.body.password as string

    const {
        token,
        expires_in
    } = AuthService.login(password)

    const NODE_ENV = getEnsureEnv("NODE_ENV")

    res.cookie("session", token, {
        httpOnly: true,
        secure: NODE_ENV === "production",
        sameSite: NODE_ENV === "production" ? "none" : "strict",
        maxAge: expires_in
    })
    res.json({ message: "Login successful" })
}))

app.get("/analyze", authMiddleware, ErrorHandler.routeHandler(async (req, res) => {
    const host = req.query.host as string
    const path = req.query.path as string
    const virtualWeb = virtualWebStore.getOrCreate({ host, mainPathname: path, webSummary: null }).vdomStore.getOrCreate(path)
    const response = await virtualWeb.analyze()
    res.json(response)
}))

app.get("/validations", authMiddleware, ErrorHandler.routeHandler(async (req, res) => {
    const host = req.query.host as string
    const path = req.query.path as string
    const virtualWeb = virtualWebStore.getOrCreate({ host, mainPathname: path, webSummary: null }).vdomStore.getOrCreate(path)
    res.json({
        validations: virtualWeb.domValidator.getValidations()
    })
}))

app.get("/context", authMiddleware, ErrorHandler.routeHandler(async (req, res) => {

    const host = req.query.host as string
    const path = req.query.path as string

    const virtualWeb = virtualWebStore.getOrCreate({ host, mainPathname: path, webSummary: null })

    const { webSummary } = await virtualWeb.generateWebSummary()

    res.json(webSummary)
}))

app.get("/json", authMiddleware, ErrorHandler.routeHandler(async (req, res) => {
    const url = req.query.url as string
    const virtualWeb = virtualWebStore.getOrCreate({ host: url, mainPathname: url, webSummary: null }).vdomStore.getOrCreate(url)
    const snapshot = await virtualWeb.getOrGenerateSnapshot()
    res.json({
        json: snapshot.root
    })
}))

app.post("/create", authMiddleware, ErrorHandler.routeHandler(
    async (req, res) => {
        const url = req.body.url as string
        const virtualWeb = virtualWebStore.getOrCreate({ host: url, mainPathname: url, webSummary: null }).vdomStore.getOrCreate(url)
        virtualWeb.clearSnapshot()
        await virtualWeb.getOrGenerateSnapshot()
        res.status(201).json({ message: "VirtualDom created" })
    }))

app.get("/html", authMiddleware, ErrorHandler.routeHandler(async (req, res) => {
    const url = req.query.url as string
    const virtualWeb = virtualWebStore.getOrCreate({ host: url, mainPathname: url, webSummary: null }).vdomStore.getOrCreate(url)
    const { htmlStructure } = await virtualWeb.getOrGenerateSnapshot()
    res.json({
        htmlStructure
    })
}))

app.use(errorGlobal)
app.listen(3000, () => console.log("ON"))