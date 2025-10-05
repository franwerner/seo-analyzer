import { Router } from "express";
import AuthController from "../controllers/auth.controller";

const AuthRouter = Router()

AuthRouter.post("/login", AuthController.login)


export default AuthRouter