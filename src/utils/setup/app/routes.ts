import { Express } from "express";
import authRouter from "routes/auth";
import roomRouter from "routes/room";

function setupRoutes(app: Express) {
  app.get("/", (_, res) => res.send("Hello world!"));
  app.use("/auth", authRouter);
  app.use("/room", roomRouter);
}

export default setupRoutes;
