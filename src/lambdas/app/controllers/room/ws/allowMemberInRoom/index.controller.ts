import { ApiError } from "@appLambda/middleware/errors";
import DatabaseClients from "@appLambda/services/db";
import makeAsyncController from "@appLambda/utils/reqRes/asyncController";
import makeRoomModel from "models/Room/index.model";
import { fromZodError } from "zod-validation-error";
import { ConnectedRoomMember, RoomMember } from "models/Room/schemas/member";
import {
  getIsConnectionIdSameAsAdmin,
  getOtherAllowedMembersConnectionIds,
  processAdminDecisionOnNewMember,
  sendPromptsToOpenNewConnection,
} from "./_utils/connectionHelpers";
import RoomWsAllowMemberInRoomBodyValidator from "./_utils/bodyValidator";

/**
 * Only admin is allowed in this route. So we check the connectionId internally, before conducting
 * any actions.
 */
function makeWsAllowMemberInRoomController(databaseClients: DatabaseClients) {
  return makeAsyncController(async (req, res, next) => {
    const bodyParseResult = RoomWsAllowMemberInRoomBodyValidator.safeParse(
      req.body
    );
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
    const isSenderTheAdmin = getIsConnectionIdSameAsAdmin(
      requestedRoom,
      senderConnectionId
    );
    if (!isSenderTheAdmin) {
      const msg = "Only the admin of a room is allowed to send this request";
      next(new ApiError(403, msg));
      return;
    }

    // make the new member an allowed member
    const newMember = requestedRoom.members.get(newMemberId);
    if (!(newMember && getIsMemberConnected(newMember))) {
      const msg = "The new member isn't a connected member of the room";
      next(new ApiError(400, msg));
      return;
    }
    await processAdminDecisionOnNewMember({
      isNewMemberAllowedInRoom,
      requestedRoom,
      newMember,
    });

    // ask other members to connect to new member
    const otherMembersConnectionIds = getOtherAllowedMembersConnectionIds(
      requestedRoom,
      newMemberId
    );
    await sendPromptsToOpenNewConnection(
      otherMembersConnectionIds,
      newMemberId
    );

    res.status(200).send("Member allowed, and prompts sent");
  });
}

function getIsMemberConnected(
  member: RoomMember
): member is ConnectedRoomMember {
  return !!member.connectionId;
}

export default makeWsAllowMemberInRoomController;
