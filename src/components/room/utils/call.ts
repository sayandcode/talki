import { redirectToInternalUrl } from "utils/functions/redirects";
import type { RoomId } from "utils/types/Room";
import { createRoom, tryJoinRoom } from "./room-http";
import { setRoomIdInUrl } from "./url";

async function joinExistingCall(roomId: RoomId) {
  const joinAttempt = await tryJoinRoom(roomId);
  if (!joinAttempt.success) {
    redirectToInternalUrl("/room/404");
    return { success: false } as const;
  }
  return { success: true, data: joinAttempt.data } as const;
}

async function startNewCall() {
  const newRoomData = await createRoom();
  setRoomIdInUrl(newRoomData.roomId);
  return newRoomData;
}

export { joinExistingCall, startNewCall };
