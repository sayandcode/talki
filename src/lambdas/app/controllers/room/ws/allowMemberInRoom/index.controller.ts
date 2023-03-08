import { ApiError } from "@appLambda/middleware/errors";
import DatabaseClients from "@appLambda/services/db";
import {
  getIsMemberAllowed,
  getIsMemberConnected,
} from "models/Room/schemas/member/helperFns";
import RoomWsAllowMemberInRoomBodyValidator from "./_utils/bodyValidator";
import askOtherMembersToConnectToNewMember from "./_utils/askOtherMembersToConnectToNewMember";
import processAdminDecisionOnNewMember from "./_utils/processAdminDecisionOnNewMember";
import makeRoomWsController from "../_utils/makeRoomWsController";

/**
 * Only admin is allowed in this route. So we check the connectionId internally, before conducting
 * any actions.
 */
function makeRoomWsAllowMemberInRoomController(
  databaseClients: DatabaseClients
) {
  return makeRoomWsController(
    databaseClients,
    RoomWsAllowMemberInRoomBodyValidator,
    async (reqData, res, next) => {
      const {
        requestedRoom,
        requestingMember,
        reqBody: {
          newMemberId,
          isAllowedInRoom: isNewMemberAllowedInRoomByAdmin,
        },
      } = reqData;

      // verify that sender is admin
      const isSenderTheAdmin =
        requestingMember.memberId === requestedRoom.adminMemberId;
      if (!isSenderTheAdmin) {
        const msg = "Only the admin of a room is allowed to send this request";
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
  );
}

export default makeRoomWsAllowMemberInRoomController;
