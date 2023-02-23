import roomCreateEndpoint, {
  RoomCreateEndpoint,
} from "utils/endpoints/room/create";
import roomJoinEndpoint, { RoomJoinEndpoint } from "utils/endpoints/room/join";
import backendFetch from "utils/functions/backendFetch";
import type { RoomId } from "utils/types/Room";
import setRoomIdOnPage from "../pageManip/roomId";
import addStreamContainer from "../pageManip/streamContainer";
import { getRoomIdFromUrl, setRoomIdInUrl } from "../url";
import connectRoomWs from "./connectRoomWs";

async function startSession() {
  const roomId = getRoomIdFromUrl();

  const localStream = await navigator.mediaDevices.getUserMedia({
    video: true,
  });
  addStreamContainer(localStream);

  if (roomId) {
    setRoomIdOnPage(roomId);
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
  setRoomIdInUrl(roomId);
  setRoomIdOnPage(roomId);
  await connectRoomWs({ wsUrl, roomId, memberId, nonce, expireAt });
}

export default startSession;
