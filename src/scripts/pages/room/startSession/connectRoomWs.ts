import type {
  RoomMemberId,
  RoomNonce,
  RoomId,
  RoomWsUrl,
  RoomExpireAt,
} from "utils/types/Room";

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

export default connectRoomWs;
