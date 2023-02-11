import makeAuthLoginController from "controllers/auth/login/index.controller";
import makeAuthNonceController from "controllers/auth/nonce/index.controller";
import authStatusController from "controllers/auth/status";
import { Router } from "express";
import DatabaseClients from "services/db";

function makeAuthRouter(databaseClients: DatabaseClients) {
  const authRouter = Router();

  authRouter.get("/status", authStatusController);
  authRouter.get("/nonce", makeAuthNonceController(databaseClients));
  authRouter.put("/login", makeAuthLoginController(databaseClients));

  return authRouter;
}

export default makeAuthRouter;
