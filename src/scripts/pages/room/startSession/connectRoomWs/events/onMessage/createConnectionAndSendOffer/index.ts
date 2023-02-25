import connectionsManager from "scripts/pages/room/startSession/connections/manager";
import RoomValidators, { RoomId } from "utils/types/Room";
import { z } from "zod";
import sendOfferToRoomWs from "./sendOffer";

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
  const validation = PayloadValidator.safeParse(payload);
  if (!validation.success)
    throw new Error("'sendSdp' payload did not contain the expected data");
  const { newMemberId } = validation.data;

  const pc = connectionsManager.createConnection(newMemberId);
  const offerSdp = await pc.createOffer();
  sendOfferToRoomWs({ roomWs, offerSdp, newMemberId, roomId });
}

export default createConnectionAndSendOffer;
