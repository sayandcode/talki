import type { RoomId, RoomMemberId } from "utils/types/Room";

type ConnectionData = {
  // eslint-disable-next-line no-undef
  offerSdp: RTCSessionDescriptionInit;
  roomWs: WebSocket;
  newMemberId: RoomMemberId;
  roomId: RoomId;
};

function sendOfferToRoomWs({
  roomWs,
  offerSdp,
  newMemberId,
  roomId,
}: ConnectionData) {
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
