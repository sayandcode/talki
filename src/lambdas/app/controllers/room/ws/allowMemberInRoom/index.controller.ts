import { ApiError } from "@appLambda/middleware/errors";
import DatabaseClients from "@appLambda/services/db";
import makeAsyncController from "@appLambda/utils/reqRes/asyncController";
import WsBackend from "@utils/WsBackend";
import RoomModelValidators from "models/Room/index.validator";
import makeRoomModel from "models/Room/index.model";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import APP_ENV_VARS from "@appLambda/env";

const BodyValidator = z.object({
  connectionId: RoomModelValidators.connectionId,
  isAllowedInRoom: z.boolean(),
  newMemberId: RoomModelValidators.memberId,
  roomId: RoomModelValidators.roomId,
});

const wsUrl = APP_ENV_VARS.ROOM_WS_URL;
const wsBackend = new WsBackend(wsUrl);

/**
 * Only admin is allowed in this route. So we check the connectionId internally, before conducting
 * any actions.
 */
function makeWsAllowMemberInRoomController(databaseClients: DatabaseClients) {
  return makeAsyncController(async (req, res, next) => {
    const bodyParseResult = BodyValidator.safeParse(req.body);
    if (!bodyParseResult.success) {
      const errMsg = fromZodError(bodyParseResult.error).message;
      next(new ApiError(400, errMsg));
      return;
    }
    const {
      roomId,
      newMemberId,
      isAllowedInRoom: isNewMemberAllowedInRoom,
      connectionId: senderConnectionId,
    } = bodyParseResult.data;

    const Room = makeRoomModel(databaseClients.mongoClient);
    const requestedRoom = await Room.findById(roomId);
    if (!requestedRoom) {
      next(new ApiError(400, "Requested room doesn't exist"));
      return;
    }

    // verify that sender is admin
    const senderMember =
      requestedRoom.getMemberFromConnectionId(senderConnectionId);
    const isSenderTheAdmin =
      senderMember && senderMember.memberId === requestedRoom.adminMemberId;
    if (!isSenderTheAdmin) {
      const msg = "Only the admin of a room is allowed to send this request";
      next(new ApiError(403, msg));
      return;
    }

    // make the new member an allowed member
    const newMember = requestedRoom.members.get(newMemberId);
    if (!newMember) {
      const msg = "newMemberId doesn't refer to a real member";
      next(new ApiError(400, msg));
      return;
    }
    if (!isNewMemberAllowedInRoom) {
      requestedRoom.members.delete(newMemberId);
    } else {
      newMember.isAllowedInRoom = true;
    }
    await requestedRoom.save();

    // find all allowed members
    const connectionIdsToSendNewConnectionPrompt: string[] = [];
    for (const member of requestedRoom.members.values()) {
      if (member.memberId === newMemberId) break;
      if (!member.connectionId)
        throw new Error("Allowed member doesn't have a connectionId");
      connectionIdsToSendNewConnectionPrompt.push(member.connectionId);
    }

    // send them a prompt to open a new connection
    connectionIdsToSendNewConnectionPrompt.forEach(async (connectionId) => {
      const msg = { action: "sendConnectionOffer", payload: { newMemberId } };
      await wsBackend.sendMsgToWs(connectionId, msg);
    });

    res.send();
  });
}

export default makeWsAllowMemberInRoomController;
