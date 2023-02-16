import makeRoomModel, { RoomDocument } from "models/Room/index.model";
import { RoomMemberSchemaType } from "models/Room/schemas/member";
import DatabaseClients from "@appLambda/services/db";
import { RequiredRoomWs$connectBody } from "./bodyValidator";
import wsBackend from "./_utils/wsBackend";

type ConnectionAttempResult = Promise<
  { success: false } | { success: true; requestedRoom: RoomDocument }
>;
async function attemptConnection(
  body: RequiredRoomWs$connectBody,
  databaseClients: DatabaseClients
): ConnectionAttempResult {
  const { nonce, roomId, memberId, connectionId } = body;
  const Room = makeRoomModel(databaseClients.mongoClient);
  const requestedRoom = await Room.findById(roomId);
  if (!requestedRoom) return { success: false };
  const success = await requestedRoom.confirmConnection({
    memberId,
    nonce,
    connectionId,
  });

  if (!success) {
    return { success: false };
  }
  return { success: true, requestedRoom };
}

async function askAdminForEntryPermission({
  requestingMemberId,
  requestedRoom,
}: {
  requestingMemberId: RoomMemberSchemaType["memberId"];
  requestedRoom: RoomDocument;
}) {
  const { adminMemberId } = requestedRoom;
  if (adminMemberId === requestingMemberId)
    throw new Error("Cannot add admin as a new member to room");
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

  if (!adminMember.connectionId)
    throw new Error("Admin member doesn't have connectionId yet");
  await wsBackend.sendMsgToWs(adminMember.connectionId, msg);

  return { requestingMember, adminMember };
}

export { attemptConnection, askAdminForEntryPermission };
