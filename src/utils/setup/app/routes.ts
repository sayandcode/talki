import { Express } from "express";
import makeAuthRouter from "routes/auth";
import makeRoomRouter from "routes/room";
import DatabaseClients from "services/db";

function setupRoutes(app: Express, databaseClients: DatabaseClients) {
  app.get("/", (_, res) => res.send("Hello world!"));
  app.use("/auth", makeAuthRouter(databaseClients));
  app.use("/room", makeRoomRouter(databaseClients));
}

export default setupRoutes;
