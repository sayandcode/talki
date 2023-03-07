import type { RoomId, RoomMemberId } from "utils/types/Room";
import type { StringifiedIceCandidate } from "../../connection";
import type RoomWs from "../../RoomWs";

function sendIceCandidateToRoomWs({
  roomWs,
  roomId,
  receiverMemberId,
  stringifiedIceCandidate,
}: {
  roomWs: RoomWs["ws"];
  roomId: RoomId;
  receiverMemberId: RoomMemberId;
  stringifiedIceCandidate: StringifiedIceCandidate;
}) {
  const msg = {
    action: "sendIceCandidate",
    payload: {
      stringifiedIceCandidate,
      roomId,
      receiverMemberId,
    },
  };
  roomWs.send(JSON.stringify(msg));
}

export default sendIceCandidateToRoomWs;
