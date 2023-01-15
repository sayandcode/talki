import authLoginController from "controllers/auth/login/controller";
import authNonceController from "controllers/auth/nonce/controller";
import authStatusController from "controllers/auth/status";
import { Router } from "express";

const authRouter = Router();

authRouter.get("/status", authStatusController);
authRouter.get("/nonce", authNonceController);
authRouter.put("/login", authLoginController);

export default authRouter;
