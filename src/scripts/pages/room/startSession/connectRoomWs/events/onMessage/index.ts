import type { RoomId } from "utils/types/Room";
import { z } from "zod";
import askEntryPermissionToUser from "../../askEntryPermission";

const MessageValidator = z.object({
  action: z.string(),
  payload: z.unknown(),
}) satisfies z.ZodSchema<{ action: string; payload?: unknown }>;

function getRoomWsOnMessageHandler({
  roomWs,
  roomId,
}: {
  roomWs: WebSocket;
  roomId: RoomId;
}) {
  return (e: MessageEvent) => {
    const msg = MessageValidator.parse(JSON.parse(e.data));
    console.log("Message received from websocket", msg);

    switch (msg.action) {
      case "askEntryPermission":
        askEntryPermissionToUser({
          payload: msg.payload,
          roomWs,
          roomId,
        });
        break;

      case "promptSdp":
        // create new connection and send the offer to websocket
        break;

      case "sendSdp":
        // create an answer for the offer, and send to websocket
        break;

      case "sendIceCandidate":
        // add ice candidate to respective peerconnection
        break;

      default:
        throw new Error("Unexpected websocket action");
    }
  };
}

export default getRoomWsOnMessageHandler;
