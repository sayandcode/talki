import { ApiError } from "@appLambda/middleware/errors";
import DatabaseClients from "@appLambda/services/db";
import { getIsMemberAllowed } from "models/Room/schemas/member/helperFns";
import makeRoomWsController from "../_utils/makeRoomWsController";
import RoomWsSendSdpBodyValidator from "./_utils/bodyValidator";
import sendSdp from "./_utils/sendSdp";

function makeRoomWsSendSdpController(databaseClients: DatabaseClients) {
  return makeRoomWsController(
    databaseClients,
    RoomWsSendSdpBodyValidator,
    async (reqData, res, next) => {
      const {
        requestingMember: senderMember,
        requestedRoom,
        reqBody: { receiverMemberId, sdp },
      } = reqData;

      // are both members allowed in room?
      const receiverMember = requestedRoom.members.get(receiverMemberId);
      const isReceiverAllowedInRoom =
        receiverMember && getIsMemberAllowed(receiverMember);
      const isBothMembersAllowedInRoom =
        getIsMemberAllowed(senderMember) && isReceiverAllowedInRoom;
      if (!isBothMembersAllowedInRoom) {
        const msg =
          "This message can only be sent between allowed members of room";
        next(new ApiError(403, msg));
        return;
      }

      await sendSdp({ senderMember, receiverMember, sdp });
      res.status(200).send("SDP sent");
    }
  );
}

export default makeRoomWsSendSdpController;
