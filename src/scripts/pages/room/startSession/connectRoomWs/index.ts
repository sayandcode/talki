import type {
  RoomMemberId,
  RoomNonce,
  RoomId,
  RoomWsUrl,
  RoomExpireAt,
} from "utils/types/Room";
import setupRoomWsAutoClose from "./close";
import setupRoomWsEventListeners from "./events";
import getFullRoomWsUrl from "./url";

async function connectRoomWs({
  wsUrl,
  roomId,
  memberId,
  nonce,
  expireAt,
}: {
  wsUrl: RoomWsUrl;
  roomId: RoomId;
  memberId: RoomMemberId;
  nonce: RoomNonce;
  expireAt: RoomExpireAt;
}) {
  const fullRoomWsUrl = getFullRoomWsUrl({ wsUrl, roomId, memberId, nonce });
  const roomWs = new WebSocket(fullRoomWsUrl);

  setupRoomWsAutoClose(roomWs, expireAt);
  setupRoomWsEventListeners(roomWs, { roomId, expireAt });
}

export default connectRoomWs;
