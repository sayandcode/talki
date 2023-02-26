import type { StringifiedIceCandidate } from "scripts/pages/room/startSession/connections/connection";
import type { RoomId, RoomMemberId } from "utils/types/Room";

function sendIceCandidateToRoomWs({
  roomWs,
  roomId,
  receiverMemberId,
  stringifiedIceCandidate,
}: {
  roomWs: WebSocket;
  roomId: RoomId;
  receiverMemberId: RoomMemberId;
  stringifiedIceCandidate: StringifiedIceCandidate;
}) {
  const msg = getMsg({
    stringifiedIceCandidate,
    roomId,
    receiverMemberId,
  });
  roomWs.send(JSON.stringify(msg));
}

function getMsg({
  stringifiedIceCandidate,
  receiverMemberId,
  roomId,
}: {
  stringifiedIceCandidate: StringifiedIceCandidate;
  receiverMemberId: RoomMemberId;
  roomId: RoomId;
}) {
  return {
    action: "sendIceCandidate",
    payload: {
      stringifiedIceCandidate,
      roomId,
      receiverMemberId,
    },
  };
}

export default sendIceCandidateToRoomWs;
