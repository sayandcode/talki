import type { RoomId, RoomMemberId } from "utils/types/Room";

type ConnectionData = {
  pc: RTCPeerConnection;
  roomWs: WebSocket;
  newMemberId: RoomMemberId;
  roomId: RoomId;
};

async function sendOfferToRoomWs({
  roomWs,
  pc,
  newMemberId,
  roomId,
}: ConnectionData) {
  const offerSdp = await pc.createOffer();
  const msg = getMsg({ roomId, offerSdp, newMemberId });
  roomWs.send(JSON.stringify(msg));
}

function getMsg({
  roomId,
  offerSdp,
  newMemberId,
}: {
  roomId: RoomId;
  // eslint-disable-next-line no-undef
  offerSdp: RTCSessionDescriptionInit;
  newMemberId: RoomMemberId;
}) {
  return {
    action: "sendSdp",
    payload: {
      receiverMemberId: newMemberId,
      roomId,
      sdp: offerSdp,
    },
  };
}

export default sendOfferToRoomWs;
