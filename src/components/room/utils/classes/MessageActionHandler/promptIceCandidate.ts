import RoomValidators from "utils/types/Room";
import { z } from "zod";
import MessageActionHandler from ".";
import ManagedConnection from "../managedConnection";

const PayloadValidator = z.object({
  senderMemberId: RoomValidators.RoomMemberId,
});

const promptIceCandidateActionHandler = MessageActionHandler.construct(
  "promptIceCandidate",
  PayloadValidator,
  (payload) => {
    const { senderMemberId } = payload;

    const conn = ManagedConnection.getFromMemberId(senderMemberId);
    if (!conn) throw new Error("Received prompt for invalid member");
    const { resolveWaitForPeerToPromptIceCandidates } = conn;
    if (!resolveWaitForPeerToPromptIceCandidates)
      throw new Error(
        "Connection must be able to resolve peer's prompt status"
      );
    resolveWaitForPeerToPromptIceCandidates();
  }
);

export default promptIceCandidateActionHandler;
