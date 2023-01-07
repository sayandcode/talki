import { Express } from "express";
import authRouter from "routes/auth";

function setupRoutes(app: Express) {
  app.use("/auth", authRouter);
}

export default setupRoutes;
