import roomCreateEndpoint, {
  RoomCreateEndpoint,
} from "utils/endpoints/room/create";
import backendFetch from "utils/functions/backendFetch";
import { getRoomIdFromUrl } from "./url";

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
    console.log("Joining existing call");
    return;
  }
  await startNewCall();
}

async function startNewCall() {
  const { url, method } = roomCreateEndpoint;
  const res = await backendFetch(url, { method });
  const { wsUrl, roomId, memberId, nonce, expireAt } =
    (await res.json()) as RoomCreateEndpoint["response"];

  const authParams = new URLSearchParams({ roomId, memberId, nonce });
  const fullRoomWsUrl = `${wsUrl}?${authParams.toString()}`;
  const roomWs = new WebSocket(fullRoomWsUrl);

  // auto close the websocket
  const now = new Date();
  const roomExpiryTime = new Date(expireAt);
  const timeLeft = roomExpiryTime.getTime() - now.getTime();
  setTimeout(() => roomWs.close(), timeLeft);

  roomWs.addEventListener("message", (e) => {
    const msg = JSON.parse(e.data) as { action: string; payload: any };
    console.log("Message received from websocket", msg);

    switch (msg.action) {
      case "askEntryPermission":
        // ask user if you want to let this new person in
        // send 'allowMemberInRoom' action to websocket
        break;

      case "promptSdp":
        // create new connection and send the offer to websocket
        break;

      case "sendSdp":
        // create an answer for the offer, and send to websocket
        break;

      case "sendIceCandidate":
        // add ice candidate to respective peerconnection
        break;

      default:
        throw new Error("Unexpected websocket action");
    }
  });
}

export default startSession;
