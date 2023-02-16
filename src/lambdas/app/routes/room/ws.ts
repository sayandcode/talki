import makeRoomWs$connectRoute from "@appLambda/controllers/room/ws/$connect/index.controller";
import { Router } from "express";
import DatabaseClients from "@appLambda/services/db";

/**
 * This router is unauthed. For authorization, check the connectionId in the body.
 * It is a secret value for each client, that is known only by the ws and http(this) server.
 * Therefore it acts as a password.
 */
function makeRoomWsRouter(databaseClients: DatabaseClients): Router {
  const roomWsRouter = Router();

  roomWsRouter.post("/connect", makeRoomWs$connectRoute(databaseClients));

  return roomWsRouter;
}

export default makeRoomWsRouter;
