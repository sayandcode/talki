import makeRoomCreateController from "controllers/room/create";
import { Router } from "express";
import protectWithAuth from "middleware/protected";
import DatabaseClients from "services/db";

function makeRoomRouter(databaseClients: DatabaseClients): Router {
  const roomRouter = Router();
  const roomCreateController = makeRoomCreateController(databaseClients);
  roomRouter.post("/create", protectWithAuth, roomCreateController);
  return roomRouter;
}

export default makeRoomRouter;
