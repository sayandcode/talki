import type { RoomId, RoomMemberId } from "utils/types/Room";
import type RoomWs from "../../RoomWs";

type ConnectionData = {
  sdp: RTCSessionDescriptionInit;
  roomWs: RoomWs["ws"];
  receiverMemberId: RoomMemberId;
  roomId: RoomId;
};

function sendSdpToRoomWs({
  roomWs,
  sdp,
  receiverMemberId,
  roomId,
}: ConnectionData) {
  const msg = {
    action: "sendSdp",
    payload: {
      receiverMemberId,
      roomId,
      sdp,
    },
  };

  roomWs.send(JSON.stringify(msg));
}

export default sendSdpToRoomWs;
