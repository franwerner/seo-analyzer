import { Router } from "express";
import AuthController from "../controllers/auth.controller";
import authMiddleware from "../middlewares/auth.middleware";

const AuthRouter = Router()

AuthRouter.post("/login", AuthController.login)
AuthRouter.get("/ping", authMiddleware, AuthController.ping)


export default AuthRouter