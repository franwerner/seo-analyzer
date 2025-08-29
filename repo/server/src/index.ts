import express from "express";
import "./config/dotenv.config";
import corsConfig from "./config/cors.config";
import VirtualDomStore from "./services/VirtualDomStore.service";
import ErrorHandler from "./utils/errorHandler.utils";
import errorGlobal from "./middleware/errorGlobal.middleware";
import AuthService from "./services/auth.service";
import authMiddleware from "./middleware/auth.middleware";
import cookieParser from "cookie-parser";
import getEnsureEnv from "./utils/getEnsureEnv.utils";

const app = express()

const virtualDomStore = new VirtualDomStore()

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
    const url = req.query.url as string
    const virtualDom = virtualDomStore.getIfExist(url)
    const response = await virtualDom.validateAll()
    res.json(response)
}))

app.get("/calculate-token", authMiddleware, ErrorHandler.routeHandler(async (req, res) => {
    const url = req.query.url as string
    const virtualDom = virtualDomStore.getIfExist(url)
    res.json({
        tokens: virtualDom.calculateTokens()
    })
}))

app.post("/create", authMiddleware, ErrorHandler.routeHandler(
    async (req, res) => {
        const url = req.body.url as string
        const virtualDom = virtualDomStore.createOrGet(url)
        await virtualDom.start()
        res.status(201).json({ message: "VirtualDom created" })
    }))

app.use(errorGlobal)
app.listen(3000, () => console.log("ON"))