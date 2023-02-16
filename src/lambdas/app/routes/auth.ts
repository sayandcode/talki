import makeAuthLoginController from "@appLambda/controllers/auth/login/index.controller";
import makeAuthNonceController from "@appLambda/controllers/auth/nonce/index.controller";
import authStatusController from "@appLambda/controllers/auth/status";
import { Router } from "express";
import DatabaseClients from "@appLambda/services/db";

function makeAuthRouter(databaseClients: DatabaseClients) {
  const authRouter = Router();

  authRouter.get("/status", authStatusController);
  authRouter.get("/nonce", makeAuthNonceController(databaseClients));
  authRouter.put("/login", makeAuthLoginController(databaseClients));

  return authRouter;
}

export default makeAuthRouter;
