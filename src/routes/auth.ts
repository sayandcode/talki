import authNonceController from "controllers/auth/nonce";
import { Router } from "express";

const authRouter = Router();

authRouter.get("/nonce", authNonceController);

export default authRouter;
