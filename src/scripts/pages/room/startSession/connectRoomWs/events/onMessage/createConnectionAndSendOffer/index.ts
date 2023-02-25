import RoomValidators, { RoomId } from "utils/types/Room";
import { z } from "zod";
import createConnection from "./createConnection";
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

  const pc = createConnection(newMemberId);
  await sendOfferToRoomWs({ roomWs, pc, newMemberId, roomId });
}

export default createConnectionAndSendOffer;
