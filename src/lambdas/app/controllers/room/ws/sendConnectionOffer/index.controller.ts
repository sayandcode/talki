import APP_ENV_VARS from "@appLambda/env";
import { ApiError } from "@appLambda/middleware/errors";
import DatabaseClients from "@appLambda/services/db";
import makeAsyncController from "@appLambda/utils/reqRes/asyncController";
import WsBackend from "@utils/WsBackend";
import makeRoomModel from "models/Room/index.model";
import RoomModelValidators from "models/Room/index.validator";
import { getIsMemberConnected } from "models/Room/schemas/member/helperFns";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { WebRtcValidators } from "../_utils/webRtc";

const BodyValidator = z.object({
  connectionId: RoomModelValidators.connectionId,
  newMemberId: RoomModelValidators.memberId,
  roomId: RoomModelValidators.roomId,
  offerSdp: WebRtcValidators.sdp,
});

const wsUrl = APP_ENV_VARS.ROOM_WS_URL;
const wsBackend = new WsBackend(wsUrl);

function makeRoomWsSendConnectionOffer(databaseClients: DatabaseClients) {
  return makeAsyncController(async (req, res, next) => {
    const bodyParseResult = BodyValidator.safeParse(req.body);
    if (!bodyParseResult.success) {
      const errMsg = fromZodError(bodyParseResult.error).message;
      next(new ApiError(400, errMsg));
      return;
    }
    const { connectionId, newMemberId, roomId, offerSdp } =
      bodyParseResult.data;

    const Room = makeRoomModel(databaseClients.mongoClient);
    const requestedRoom = await Room.findById(roomId);
    if (!requestedRoom) {
      next(new ApiError(404, "Requested room doesn't exist"));
      return;
    }
    const requestingMember =
      requestedRoom.getMemberFromConnectionId(connectionId);
    if (!requestingMember) {
      next(new ApiError(401, "This route is only for members"));
      return;
    }
    const offererMemberId = requestingMember.memberId;

    const newMember = requestedRoom.members.get(newMemberId);
    if (!(newMember && getIsMemberConnected(newMember))) {
      next(new ApiError(400, "The specified new member is invalid"));
      return;
    }
    const newMemberConnectionId = newMember.connectionId;

    const msg = {
      action: "sendConnectionAnswer",
      payload: {
        offererMemberId,
        offerSdp,
      },
    };
    await wsBackend.sendMsgToWs(newMemberConnectionId, msg);

    res.status(200).send("Offer sent");
  });
}

export default makeRoomWsSendConnectionOffer;
