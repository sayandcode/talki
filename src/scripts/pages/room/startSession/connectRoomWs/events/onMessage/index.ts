import type { RoomId } from "utils/types/Room";
import { z } from "zod";
import askEntryPermissionToUser from "./askEntryPermission";
import createConnectionAndSendOffer from "./createConnectionAndSendOffer";

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
    const { action, payload } = msg;

    switch (action) {
      case "askEntryPermission":
        askEntryPermissionToUser({
          payload,
          roomWs,
          roomId,
        });
        break;

      case "promptSdp":
        createConnectionAndSendOffer({ payload, roomId, roomWs });
        break;

      case "sendSdp":
        // handle received sdp
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
