import { ApiError } from "@appLambda/middleware/errors";
import DatabaseClients from "@appLambda/services/db";
import { getIsMemberAllowed } from "models/Room/schemas/member/helperFns";
import makeRoomWsController from "../_utils/makeRoomWsController";
import RoomWsPromptIceCandidateBodyValidator from "./_utils/bodyValidator";
import sendRoomWsPromptIceCandidate from "./_utils/sendWsBackend";

function makeRoomWsPromptIceCandidateController(
  databaseClients: DatabaseClients
) {
  return makeRoomWsController(
    databaseClients,
    RoomWsPromptIceCandidateBodyValidator,
    async (reqData, res, next) => {
      const {
        requestedRoom,
        requestingMember: senderMember,
        reqBody: { receiverMemberId },
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
      await sendRoomWsPromptIceCandidate({ receiverMember, senderMember });
      res.status(200).send("Ice candidate sent");
    }
  );
}

export default makeRoomWsPromptIceCandidateController;
