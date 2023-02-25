import { redirectToInternalUrl } from "utils/functions/redirects";
import type { RoomId } from "utils/types/Room";
import setRoomIdOnPage from "../pageManip/roomId";
import streamContainerManager from "../pageManip/streamContainer";
import { getRoomIdFromUrl, setRoomIdInUrl } from "../url";
import connectRoomWs from "./connectRoomWs";
import { createRoom, tryJoinRoom } from "./room";

async function startSession() {
  const roomId = getRoomIdFromUrl();

  const localStream = await navigator.mediaDevices.getUserMedia({
    video: true,
  });
  streamContainerManager.localStream = localStream;

  if (roomId) {
    joinExistingCall(roomId);
    return;
  }
  await startNewCall();
}

async function startNewCall() {
  const { wsUrl, roomId, memberId, nonce, expireAt } = await createRoom();
  setRoomIdInUrl(roomId);
  setRoomIdOnPage(roomId);
  await connectRoomWs({ wsUrl, roomId, memberId, nonce, expireAt });
}

async function joinExistingCall(roomId: RoomId) {
  const joinAttempt = await tryJoinRoom(roomId);
  if (!joinAttempt.success) {
    redirectToInternalUrl("/room/404");
    return;
  }
  setRoomIdOnPage(roomId);
  await connectRoomWs(joinAttempt.data);
}

export default startSession;
