import makeRoomModel, { RoomDocument, RoomMemberSchemaType } from "models/Room";
import DatabaseClients from "services/db";
import { RequiredRoomWs$connectBody } from "./bodyValidator";

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

function askAdminForEntryPermission({
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

  // TODO: send a request to admin's connectionId
  return { requestingMember, adminMember };
}

export { attemptConnection, askAdminForEntryPermission };
