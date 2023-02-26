import connectionsManager from "scripts/pages/room/startSession/connections/manager";
import RoomValidators, { RoomId } from "utils/types/Room";
import { z } from "zod";
import getIceEventHandler from "./_utils/iceEventHandler";
import sendSdpToRoomWs from "./_utils/sendSdp";

const PayloadValidator = z.object({
  newMemberId: RoomValidators.RoomMemberId,
});

async function createConnectionAndSendOffer({
  payload,
  roomWs,
  roomId,
}: {
  payload: unknown;
  roomWs: WebSocket;
  roomId: RoomId;
}) {
  const { newMemberId } = PayloadValidator.parse(payload);

  const pc = connectionsManager.createConnection(
    newMemberId,
    getIceEventHandler({ roomWs, roomId, receiverMemberId: newMemberId })
  );

  const offerSdp = await pc.createOffer();
  sendSdpToRoomWs({
    roomWs,
    sdp: offerSdp,
    receiverMemberId: newMemberId,
    roomId,
  });
}

export default createConnectionAndSendOffer;
