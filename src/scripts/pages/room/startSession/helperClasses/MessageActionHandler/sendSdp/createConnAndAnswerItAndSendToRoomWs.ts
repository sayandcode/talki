import type { RoomId, RoomMemberId } from "utils/types/Room";
import ManagedConnection from "../../managedConnection";
import getIceEventHandler from "../_utils/iceEventHandler";
import sendSdpToRoomWs from "../_utils/sendSdpToRoomWs";

async function createNewPcAndAnswerItAndSendToRoomWs({
  receiverMemberId,
  roomWs,
  roomId,
  offerSdp,
}: {
  receiverMemberId: RoomMemberId;
  roomWs: WebSocket;
  roomId: RoomId;
  offerSdp: RTCSessionDescriptionInit;
}) {
  const conn = new ManagedConnection(receiverMemberId);
  const iceEventHandler = getIceEventHandler({
    roomWs,
    conn,
    roomId,
    receiverMemberId,
  });
  conn.setupIceListener(iceEventHandler);
  const answerSdp = await conn.createAnswer(offerSdp);
  sendSdpToRoomWs({
    roomWs,
    roomId,
    sdp: answerSdp,
    receiverMemberId,
  });
}

export default createNewPcAndAnswerItAndSendToRoomWs;
