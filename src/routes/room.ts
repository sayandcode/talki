import makeRoomCreateController from "controllers/room/create";
import { Router } from "express";
import protectWithAuth from "middleware/protected";
import DatabaseClients from "services/db";

function makeRoomRouter(databaseClients: DatabaseClients): Router {
  const roomRouter = Router();

  roomRouter.post(
    "/create",
    protectWithAuth,
    makeRoomCreateController(databaseClients)
  );

  return roomRouter;
}

export default makeRoomRouter;
