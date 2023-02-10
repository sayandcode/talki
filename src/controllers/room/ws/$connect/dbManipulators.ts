import makeRoomModel from "models/Room";
import DatabaseClients from "services/db";
import type { RequiredRoomWs$connectBody as Body } from "./bodyValidator";

async function findMemberAndRoom({
  roomId,
  memberId,
  databaseClients,
}: {
  roomId: Body["roomId"];
  memberId: Body["memberId"];
  databaseClients: DatabaseClients;
}) {
  const Room = makeRoomModel(databaseClients.mongoClient);
  const requestedRoom = await Room.findById(roomId);
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
  connectionId: Body["connectionId"]
) {
  // eslint-disable-next-line no-param-reassign
  requestedMember.connectionId = connectionId;
  // eslint-disable-next-line no-param-reassign
  requestedMember.nonce = undefined;
  await requestedRoom.save();
}

export { findMemberAndRoom, switchNonceForConnectionId };
