import makeRoomCreateController from "controllers/room/create";
import { Router } from "express";
import protectWithAuth from "middleware/protected";
import DatabaseClients from "services/db";
import makeRoomWsRouter from "./ws";

function makeRoomRouter(databaseClients: DatabaseClients): Router {
  const roomRouter = Router();

  roomRouter.post(
    "/create",
    protectWithAuth,
    makeRoomCreateController(databaseClients)
  );
  // unauthed, as it is intended to be validated via connectionId
  roomRouter.use("/ws", makeRoomWsRouter(databaseClients));

  return roomRouter;
}

export default makeRoomRouter;
