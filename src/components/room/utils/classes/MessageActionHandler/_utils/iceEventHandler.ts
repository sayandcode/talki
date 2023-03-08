import type { RoomId, RoomMemberId } from "utils/types/Room";
import type ManagedConnection from "../../managedConnection";
import type RoomWs from "../../RoomWs";
import sendIceCandidateToRoomWs from "./sendIceToRoomWs";

function getIceEventHandler({
  roomWs,
  roomId,
  conn,
  receiverMemberId,
}: {
  roomWs: RoomWs["ws"];
  roomId: RoomId;
  conn: ManagedConnection;
  receiverMemberId: RoomMemberId;
}) {
  return async (e: RTCPeerConnectionIceEvent) => {
    if (!e.candidate) return;

    const stringifiedIceCandidate = JSON.stringify(e.candidate);
    await conn.waitForPeerToPromptIceCandidates;
    sendIceCandidateToRoomWs({
      roomWs,
      roomId,
      receiverMemberId,
      stringifiedIceCandidate,
    });
  };
}

export default getIceEventHandler;
