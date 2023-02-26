import RoomValidators from "utils/types/Room";
import { z } from "zod";
import type { StringifiedIceCandidate } from "../../../connections/connection";
import connectionsManager from "../../../connections/manager";

const PayloadValidator = z.object({
  senderMemberId: RoomValidators.RoomMemberId,
  stringifiedIceCandidate:
    z.string() satisfies z.ZodSchema<StringifiedIceCandidate>,
});

type Params = { payload: unknown };

async function addIceCandidateToConnection({ payload }: Params) {
  const { senderMemberId, stringifiedIceCandidate } =
    PayloadValidator.parse(payload);

  const conn = connectionsManager.getConnectionFromMemberId(senderMemberId);
  if (!conn) throw new Error("Received ice for invalid member");

  await conn.setIceCandidate(stringifiedIceCandidate);
}

export default addIceCandidateToConnection;
