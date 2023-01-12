import authLoginController from "controllers/auth/login/controller";
import authNonceController from "controllers/auth/nonce";
import { Router } from "express";

const authRouter = Router();

authRouter.get("/nonce", authNonceController);
authRouter.put("/login", authLoginController);

export default authRouter;
