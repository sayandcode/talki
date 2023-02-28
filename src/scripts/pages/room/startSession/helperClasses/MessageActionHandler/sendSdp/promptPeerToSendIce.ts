import type { RoomId, RoomMemberId } from "utils/types/Room";
import type RoomWs from "../../RoomWs";

type ConnectionData = {
  roomWs: RoomWs["ws"];
  receiverMemberId: RoomMemberId;
  roomId: RoomId;
};

function promptPeerToSendIceCandidates({
  roomWs,
  receiverMemberId,
  roomId,
}: ConnectionData) {
  const msg = {
    action: "promptIceCandidate",
    payload: {
      receiverMemberId,
      roomId,
    },
  };

  roomWs.send(JSON.stringify(msg));
}

export default promptPeerToSendIceCandidates;
