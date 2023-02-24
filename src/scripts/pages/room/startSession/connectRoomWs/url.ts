import type {
  RoomId,
  RoomMemberId,
  RoomNonce,
  RoomWsUrl,
} from "utils/types/Room";

function getFullRoomWsUrl({
  wsUrl,
  roomId,
  memberId,
  nonce,
}: {
  wsUrl: RoomWsUrl;
  roomId: RoomId;
  memberId: RoomMemberId;
  nonce: RoomNonce;
}) {
  const authParams = new URLSearchParams({ roomId, memberId, nonce });
  return `${wsUrl}?${authParams.toString()}`;
}

export default getFullRoomWsUrl;
