import { redirectToInternalUrl } from "utils/functions/redirects";
import type {
  RoomExpireAt,
  RoomId,
  RoomMemberId,
  RoomNonce,
  RoomWsUrl,
} from "utils/types/Room";
import { z } from "zod";
import type MessageActionHandler from "./MessageActionHandler";
import askEntryPermissionActionHandler from "./MessageActionHandler/askEntryPermission";
import promptIceCandidateActionHandler from "./MessageActionHandler/promptIceCandidate";
import promptSdpActionHandler from "./MessageActionHandler/promptSdp";
import sendIceCandidateActionHandler from "./MessageActionHandler/sendIceCandidate";
import sendSdpActionHandler from "./MessageActionHandler/sendSdp";

type RoomData = {
  wsUrl: RoomWsUrl;
  roomId: RoomId;
  memberId: RoomMemberId;
  nonce: RoomNonce;
  expireAt: RoomExpireAt;
};

class RoomWs {
  public readonly ws: WebSocket;

  constructor(public readonly roomData: RoomData) {
    const fullRoomWsUrl = this.getFullUrl();
    this.ws = new WebSocket(fullRoomWsUrl);
    this.setupAutoClose();
    this.setupRoomWsEventListeners();
    this.setupAllMessageActionHandlers();
  }

  private getFullUrl() {
    const { wsUrl, roomId, memberId, nonce } = this.roomData;
    const authParams = new URLSearchParams({ roomId, memberId, nonce });
    return `${wsUrl}?${authParams.toString()}`;
  }

  private setupAutoClose() {
    const now = new Date();
    const expiryTime = new Date(this.roomData.expireAt);
    const timeLeft = expiryTime.getTime() - now.getTime();
    setTimeout(() => this.ws.close(), timeLeft);
  }

  private setupRoomWsEventListeners() {
    this.ws.addEventListener("message", this.getOnMessageHandler());
    this.ws.addEventListener("close", this.getOnCloseHandler());
  }

  private getOnCloseHandler() {
    return () => {
      const now = new Date().getTime();
      const scheduledExpiryTime = new Date(this.roomData.expireAt).getTime();
      if (now < scheduledExpiryTime) redirectToInternalUrl("/room/exit");
    };
  }

  private MessageValidator = z.object({
    action: z.string(),
    payload: z.unknown(),
  }) satisfies z.ZodSchema<{ action: string; payload?: unknown }>;

  private getOnMessageHandler() {
    return (e: MessageEvent) => {
      const msg = this.MessageValidator.parse(JSON.parse(e.data));
      const { action, payload } = msg;

      const actionHandler = this.messageActionHandlers[action];
      if (!actionHandler) throw new Error("That action has not been defined");
      actionHandler.handlePayload(payload, this.roomData, this.ws);
    };
  }

  private messageActionHandlers: Record<
    MessageActionHandler["action"],
    MessageActionHandler
  > = {};

  // builder pattern
  private addMessageActionHandler(handler: MessageActionHandler) {
    this.messageActionHandlers[handler.action] = handler;
    return this;
  }

  private setupAllMessageActionHandlers() {
    this.addMessageActionHandler(askEntryPermissionActionHandler)
      .addMessageActionHandler(promptSdpActionHandler)
      .addMessageActionHandler(sendSdpActionHandler)
      .addMessageActionHandler(sendIceCandidateActionHandler)
      .addMessageActionHandler(promptIceCandidateActionHandler);
  }
}

export default RoomWs;
