import roomCreateEndpoint, {
  RoomCreateEndpoint,
} from "utils/endpoints/room/create";
import roomJoinEndpoint, { RoomJoinEndpoint } from "utils/endpoints/room/join";
import backendFetch from "utils/functions/backendFetch";
import type { RoomId } from "utils/types/Room";
import { getRoomIdFromUrl } from "../url";
import connectRoomWs from "./connectRoomWs";

async function startSession() {
  const roomId = getRoomIdFromUrl();

  const localStream = await navigator.mediaDevices.getUserMedia({
    video: true,
  });

  const localVidEl = document.createElement("video");
  localVidEl.height = 100;
  localVidEl.width = 100;
  localVidEl.autoplay = true;
  localVidEl.srcObject = localStream;
  document.getElementById("streams-container")?.appendChild(localVidEl);

  if (roomId) {
    joinExistingCall(roomId);
    return;
  }
  await startNewCall();
}

async function joinExistingCall(roomId: RoomId) {
  const { url, method } = roomJoinEndpoint;
  const body: RoomJoinEndpoint["body"] = { roomId };
  const res = await backendFetch(url, { method, body: JSON.stringify(body) });
  const { wsUrl, memberId, nonce, expireAt } =
    (await res.json()) as RoomJoinEndpoint["response"];
  await connectRoomWs({ wsUrl, roomId, memberId, nonce, expireAt });
}

async function startNewCall() {
  const { url, method } = roomCreateEndpoint;
  const res = await backendFetch(url, { method });
  const { wsUrl, roomId, memberId, nonce, expireAt } =
    (await res.json()) as RoomCreateEndpoint["response"];
  await connectRoomWs({ wsUrl, roomId, memberId, nonce, expireAt });
}

export default startSession;
