import WsBackend from "@utils/WsBackend";
import { RoomDocument } from "models/Room/index.model";
import { RoomMemberSchemaType } from "models/Room/schemas/member";
import ROOM_WS_AUTHORIZER_ENV_VARS from "../../env";

const wsUrl = ROOM_WS_AUTHORIZER_ENV_VARS.ROOM_WS_URL;
const wsBackend = new WsBackend(wsUrl);

/**
 * @returns isAskAttempt boolean - Whether or not we were able to ask the admin for permission.
 * If it returns false, that means that the admin hasn't joined yet.
 */
async function askAdminForEntryPermission({
  requestingMemberId,
  requestedRoom,
}: {
  requestingMemberId: RoomMemberSchemaType["memberId"];
  requestedRoom: RoomDocument;
}) {
  const { adminMemberId } = requestedRoom;
  if (adminMemberId === requestingMemberId)
    throw new Error("Admin member doesn't need to request to join room");
  const requestingMember = requestedRoom.members.get(requestingMemberId);
  const adminMember = requestedRoom.members.get(adminMemberId);
  if (!(requestingMember && adminMember))
    throw new Error("Room doesn't have either admin or new member");

  const msg = {
    action: "allowMemberInRoom",
    payload: {
      newMemberId: requestingMemberId,
      userData: requestingMember.userData,
    },
  };

  if (!adminMember.connectionId) return false; // admin hasn't joined yet
  await wsBackend.sendMsgToWs(adminMember.connectionId, msg);

  return true;
}

export default askAdminForEntryPermission;
