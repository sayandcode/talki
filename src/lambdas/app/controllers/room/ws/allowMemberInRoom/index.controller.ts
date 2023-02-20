import { ApiError } from "@appLambda/middleware/errors";
import DatabaseClients from "@appLambda/services/db";
import makeAsyncController from "@appLambda/utils/reqRes/asyncController";
import makeRoomModel from "models/Room/index.model";
import {
  getIsMemberAllowed,
  getIsMemberConnected,
} from "models/Room/schemas/member/helperFns";
import makeTypedBodyController from "@appLambda/utils/reqRes/typedParsedBody";
import RoomWsAllowMemberInRoomBodyValidator from "./_utils/bodyValidator";
import askOtherMembersToConnectToNewMember from "./_utils/askOtherMembersToConnectToNewMember";
import getIsConnectionIdSameAsAdmin from "./_utils/isConnectionIdSameAsAdmin";
import processAdminDecisionOnNewMember from "./_utils/processAdminDecisionOnNewMember";

/**
 * Only admin is allowed in this route. So we check the connectionId internally, before conducting
 * any actions.
 */
function makeRoomWsAllowMemberInRoomController(
  databaseClients: DatabaseClients
) {
  return makeAsyncController(
    makeTypedBodyController(
      RoomWsAllowMemberInRoomBodyValidator,
      async (req, res, next) => {
        const {
          roomId,
          newMemberId,
          isAllowedInRoom: isNewMemberAllowedInRoomByAdmin,
          connectionId: senderConnectionId,
        } = req.body;

        const Room = makeRoomModel(databaseClients.mongoClient);
        const requestedRoom = await Room.findById(roomId);
        if (!requestedRoom) {
          next(new ApiError(404, "Requested room doesn't exist"));
          return;
        }

        // verify that sender is admin
        const isSenderTheAdmin = getIsConnectionIdSameAsAdmin(
          requestedRoom,
          senderConnectionId
        );
        if (!isSenderTheAdmin) {
          const msg =
            "Only the admin of a room is allowed to send this request";
          next(new ApiError(403, msg));
          return;
        }

        // process the admin's decision for the new member
        const newMember = requestedRoom.members.get(newMemberId);
        const isItPossibleToAddNewMember =
          newMember &&
          getIsMemberConnected(newMember) &&
          !getIsMemberAllowed(newMember);
        if (!isItPossibleToAddNewMember) {
          const msg = "Cannot allow this member in room";
          next(new ApiError(400, msg));
          return;
        }
        await processAdminDecisionOnNewMember({
          isNewMemberAllowedInRoomByAdmin,
          requestedRoom,
          newMember,
        });

        // ask other members to connect to new member
        if (isNewMemberAllowedInRoomByAdmin)
          await askOtherMembersToConnectToNewMember(requestedRoom, newMemberId);

        res.status(200).send("Member allowed, and prompts sent");
      }
    )
  );
}

export default makeRoomWsAllowMemberInRoomController;
