import type { RoomExpireAt, RoomId } from "utils/types/Room";
import getRoomWsOnCloseHandler from "./onClose";
import getRoomWsOnMessageHandler from "./onMessage";

type RoomData = {
  roomId: RoomId;
  expireAt: RoomExpireAt;
};

function setupRoomWsEventListeners(
  roomWs: WebSocket,
  { roomId, expireAt }: RoomData
) {
  roomWs.addEventListener(
    "message",
    getRoomWsOnMessageHandler({ roomWs, roomId })
  );
  roomWs.addEventListener("close", getRoomWsOnCloseHandler({ expireAt }));
}
export default setupRoomWsEventListeners;
