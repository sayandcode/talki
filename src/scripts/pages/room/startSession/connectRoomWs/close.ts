import type { RoomExpireAt } from "utils/types/Room";

function setupRoomWsAutoClose(ws: WebSocket, expireAt: RoomExpireAt) {
  const now = new Date();
  const expiryTime = new Date(expireAt);
  const timeLeft = expiryTime.getTime() - now.getTime();
  setTimeout(() => ws.close(), timeLeft);
}

export default setupRoomWsAutoClose;
