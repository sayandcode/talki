import { ApiError } from "@appLambda/middleware/errors";
import DatabaseClients from "@appLambda/services/db";
import { getIsMemberAllowed } from "models/Room/schemas/member/helperFns";
import makeRoomWsController from "../_utils/makeRoomWsController";
import BodyValidator from "./_utils/bodyValidator";
import sendRoomWsIceCandidate from "./_utils/sendWsBackend";

function makeRoomWsSendIceCandidateController(
  databaseClients: DatabaseClients
) {
  return makeRoomWsController(
    databaseClients,
    BodyValidator,
    async (reqData, res, next) => {
      const {
        requestedRoom,
        requestingMember: senderMember,
        reqBody,
      } = reqData;
      const { receiverMemberId, stringifiedIceCandidate } = reqBody;

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

      await sendRoomWsIceCandidate({
        receiverMember,
        senderMember,
        stringifiedIceCandidate,
      });
      res.status(200).send("Ice candidate sent");
    }
  );
}
export default makeRoomWsSendIceCandidateController;
