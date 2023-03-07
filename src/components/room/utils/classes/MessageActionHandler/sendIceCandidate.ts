import RoomValidators from "utils/types/Room";
import { z } from "zod";
import MessageActionHandler from ".";
import type { StringifiedIceCandidate } from "../connection";
import ManagedConnection from "../managedConnection";

const PayloadValidator = z.object({
  senderMemberId: RoomValidators.RoomMemberId,
  stringifiedIceCandidate:
    z.string() satisfies z.ZodSchema<StringifiedIceCandidate>,
});

const sendIceCandidateActionHandler = MessageActionHandler.construct(
  "sendIceCandidate",
  PayloadValidator,
  async (payload) => {
    const { senderMemberId, stringifiedIceCandidate } = payload;

    const conn = ManagedConnection.getFromMemberId(senderMemberId);
    if (!conn) throw new Error("Received ice for invalid member");

    await conn.setIceCandidate(stringifiedIceCandidate);
  }
);

export default sendIceCandidateActionHandler;
