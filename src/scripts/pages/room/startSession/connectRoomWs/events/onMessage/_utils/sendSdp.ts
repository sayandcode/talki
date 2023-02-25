import type { RoomId, RoomMemberId } from "utils/types/Room";

type ConnectionData = {
  sdp: RTCSessionDescriptionInit;
  roomWs: WebSocket;
  receiverMemberId: RoomMemberId;
  roomId: RoomId;
};

function sendSdpToRoomWs({
  roomWs,
  sdp,
  receiverMemberId,
  roomId,
}: ConnectionData) {
  const msg = getMsg({ roomId, sdp, receiverMemberId });
  roomWs.send(JSON.stringify(msg));
}

function getMsg({
  roomId,
  sdp,
  receiverMemberId,
}: {
  roomId: RoomId;
  sdp: RTCSessionDescriptionInit;
  receiverMemberId: RoomMemberId;
}) {
  return {
    action: "sendSdp",
    payload: {
      receiverMemberId,
      roomId,
      sdp,
    },
  };
}

export default sendSdpToRoomWs;
