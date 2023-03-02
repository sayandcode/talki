import { redirectToInternalUrl } from "utils/functions/redirects";
import type { RoomId } from "utils/types/Room";
import LocalStreamManager from "../pageManip/LocalStreamManager";
import setRoomIdOnPage from "../pageManip/roomId";
import { getRoomIdFromUrl, setRoomIdInUrl } from "../url";
import RoomWs from "./helperClasses/RoomWs";
import { createRoom, tryJoinRoom } from "./room-http";

async function startSession() {
  const roomId = getRoomIdFromUrl();

  const localStream = await navigator.mediaDevices.getUserMedia({
    video: true,
  });
  LocalStreamManager.stream = localStream;

  if (roomId) {
    await joinExistingCall(roomId);
    return;
  }
  await startNewCall();
}

async function startNewCall() {
  const roomData = await createRoom();
  const { roomId } = roomData;
  setRoomIdInUrl(roomId);
  setRoomIdOnPage(roomId);
  // eslint-disable-next-line no-new
  new RoomWs(roomData);
}

async function joinExistingCall(roomId: RoomId) {
  const joinAttempt = await tryJoinRoom(roomId);
  if (!joinAttempt.success) {
    redirectToInternalUrl("/room/404");
    return;
  }
  setRoomIdOnPage(roomId);
  // eslint-disable-next-line no-new
  new RoomWs(joinAttempt.data);
}

export default startSession;
