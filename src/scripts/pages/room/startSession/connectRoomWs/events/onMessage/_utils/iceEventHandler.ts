import type { RoomId, RoomMemberId } from "utils/types/Room";
import sendIceCandidateToRoomWs from "./sendIce";

function getIceEventHandler({
  roomWs,
  roomId,
  receiverMemberId,
}: {
  roomWs: WebSocket;
  roomId: RoomId;
  receiverMemberId: RoomMemberId;
}) {
  return (e: RTCPeerConnectionIceEvent) => {
    if (!e.candidate) return;

    const stringifiedIceCandidate = JSON.stringify(e.candidate);
    sendIceCandidateToRoomWs({
      roomWs,
      roomId,
      receiverMemberId,
      stringifiedIceCandidate,
    });
  };
}

export default getIceEventHandler;
