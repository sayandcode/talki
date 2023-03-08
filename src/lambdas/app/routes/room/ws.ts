import { Router } from "express";
import DatabaseClients from "@appLambda/services/db";
import makeRoomWsAllowMemberInRoomController from "@appLambda/controllers/room/ws/allowMemberInRoom/index.controller";
import makeRoomWsSendSdpController from "@appLambda/controllers/room/ws/sendSdp/index.controller";
import makeRoomWsSendIceCandidateController from "@appLambda/controllers/room/ws/sendIceCandidate/index.controller";
import makeRoomWsPromptIceCandidateController from "@appLambda/controllers/room/ws/promptIceCandidate";

/**
 * This router is unauthed. For authorization, check the connectionId in the body.
 * It is a secret value for each client, that is known only by the ws and http(this) server.
 * Therefore it acts as a password.
 */
function makeRoomWsRouter(databaseClients: DatabaseClients): Router {
  const roomWsRouter = Router();

  roomWsRouter.post(
    "/allowMemberInRoom",
    makeRoomWsAllowMemberInRoomController(databaseClients)
  );
  roomWsRouter.post("/sendSdp", makeRoomWsSendSdpController(databaseClients));
  roomWsRouter.post(
    "/promptIceCandidate",
    makeRoomWsPromptIceCandidateController(databaseClients)
  );
  roomWsRouter.post(
    "/sendIceCandidate",
    makeRoomWsSendIceCandidateController(databaseClients)
  );

  return roomWsRouter;
}

export default makeRoomWsRouter;
