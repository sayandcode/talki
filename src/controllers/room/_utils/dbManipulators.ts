import { SessionData } from "express-session";
import makeRoomModel, { RoomId, RoomMemberSchemaType } from "models/Room";
import DatabaseClients from "services/db";
import generateNonce from "utils/generateNonce";

async function findRoom({
  roomId,
  databaseClients,
}: {
  roomId: RoomId;
  databaseClients: DatabaseClients;
}) {
  const Room = makeRoomModel(databaseClients.mongoClient);
  const requestedRoom = await Room.findById(roomId);
  return requestedRoom || null;
}

async function findMemberAndRoom({
  roomId,
  memberId,
  databaseClients,
}: {
  roomId: RoomId;
  memberId: RoomMemberSchemaType["memberId"];
  databaseClients: DatabaseClients;
}) {
  const requestedRoom = await findRoom({ roomId, databaseClients });
  if (!requestedRoom) return null;

  const requestedMember = requestedRoom.members.get(memberId);
  const isReqValid = !!requestedMember;
  if (!isReqValid) return null;

  return { requestedRoom, requestedMember };
}

async function switchNonceForConnectionId(
  {
    requestedRoom,
    requestedMember,
  }: NonNullable<Awaited<ReturnType<typeof findMemberAndRoom>>>,
  connectionId: NonNullable<RoomMemberSchemaType["connectionId"]>
) {
  // eslint-disable-next-line no-param-reassign
  requestedMember.connectionId = connectionId;
  // eslint-disable-next-line no-param-reassign
  requestedMember.nonce = undefined;
  await requestedRoom.save();
}

function createRoomMember(
  userData: SessionData["userData"],
  isFirstMember: boolean
) {
  const memberId = userData.userId;
  const memberData = {
    userData,
    memberId,
    connectionId: undefined,
    nonce: generateNonce().nonce, // to verify identity in ws connection
    isAdmin: isFirstMember,
    isAllowedInRoom: isFirstMember,
  };
  return memberData;
}

export {
  findRoom,
  findMemberAndRoom,
  switchNonceForConnectionId,
  createRoomMember,
};
