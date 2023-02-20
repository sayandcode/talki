import APP_ENV_VARS from "@appLambda/env";
import { ApiError } from "@appLambda/middleware/errors";
import DatabaseClients from "@appLambda/services/db";
import WsBackend from "@utils/WsBackend";
import RoomModelValidators from "models/Room/index.validator";
import { getIsMemberConnected } from "models/Room/schemas/member/helperFns";
import { z } from "zod";
import makeRoomWsController from "../_utils/makeRoomWsController";
import { WebRtcValidators } from "../_utils/webRtc";

const BodyValidator = z.object({
  newMemberId: RoomModelValidators.memberId,
  offerSdp: WebRtcValidators.sdp,
});

const wsUrl = APP_ENV_VARS.ROOM_WS_URL;
const wsBackend = new WsBackend(wsUrl);

function makeRoomWsSendConnectionOffer(databaseClients: DatabaseClients) {
  return makeRoomWsController(
    databaseClients,
    BodyValidator,
    async (reqData, res, next) => {
      const {
        requestingMember,
        requestedRoom,
        reqBody: { newMemberId, offerSdp },
      } = reqData;

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
    }
  );
}

export default makeRoomWsSendConnectionOffer;
