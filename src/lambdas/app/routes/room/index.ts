import makeRoomCreateController from "@appLambda/controllers/room/create";
import makeRoomJoinController from "@appLambda/controllers/room/join";
import { Router } from "express";
import protectWithAuth from "@appLambda/middleware/protected";
import DatabaseClients from "@appLambda/services/db";
import makeRoomWsRouter from "./ws";

function makeRoomRouter(databaseClients: DatabaseClients): Router {
  const roomRouter = Router();

  roomRouter.post(
    "/create",
    protectWithAuth,
    makeRoomCreateController(databaseClients)
  );
  roomRouter.post(
    "/join",
    protectWithAuth,
    makeRoomJoinController(databaseClients)
  );

  // unauthed, as it is intended to be validated via connectionId
  roomRouter.use("/ws", makeRoomWsRouter(databaseClients));

  return roomRouter;
}

export default makeRoomRouter;
