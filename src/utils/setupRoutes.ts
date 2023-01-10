import { Express } from "express";
import authRouter from "routes/auth";

function setupRoutes(app: Express) {
  app.get("/", (_, res) => res.send("Hello world!"));
  app.use("/auth", authRouter);
}

export default setupRoutes;
