import { Router } from "express";
import DatabaseClients from "@appLambda/services/db";

/**
 * This router is unauthed. For authorization, check the connectionId in the body.
 * It is a secret value for each client, that is known only by the ws and http(this) server.
 * Therefore it acts as a password.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function makeRoomWsRouter(_databaseClients: DatabaseClients): Router {
  const roomWsRouter = Router();

  return roomWsRouter;
}

export default makeRoomWsRouter;
