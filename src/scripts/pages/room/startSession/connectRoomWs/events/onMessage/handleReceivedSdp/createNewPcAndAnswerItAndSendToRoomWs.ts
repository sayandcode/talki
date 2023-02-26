import connectionsManager from "scripts/pages/room/startSession/connections/manager";
import type { RoomId, RoomMemberId } from "utils/types/Room";
import getIceEventHandler from "../_utils/iceEventHandler";
import sendSdpToRoomWs from "../_utils/sendSdp";

async function createNewPcAndAnswerItAndSendToRoomWs({
  senderMemberId,
  roomWs,
  roomId,
  offerSdp,
}: {
  senderMemberId: RoomMemberId;
  roomWs: WebSocket;
  roomId: RoomId;
  offerSdp: RTCSessionDescriptionInit;
}) {
  const pc = connectionsManager.createConnection(
    senderMemberId,
    getIceEventHandler({ roomWs, roomId, receiverMemberId: senderMemberId })
  );
  const answerSdp = await pc.createAnswer(offerSdp);
  sendSdpToRoomWs({
    roomWs,
    roomId,
    sdp: answerSdp,
    receiverMemberId: senderMemberId,
  });
}

export default createNewPcAndAnswerItAndSendToRoomWs;