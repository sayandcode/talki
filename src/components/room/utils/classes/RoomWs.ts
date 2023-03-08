/* eslint-disable no-underscore-dangle */
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

type RoomData = {
  wsUrl: RoomWsUrl;
  roomId: RoomId;
  memberId: RoomMemberId;
  nonce: RoomNonce;
  expireAt: RoomExpireAt;
};

class RoomWs {
  private _ws?: WebSocket;

  private get ws() {
    const ws = this._ws;
    if (!ws) throw new Error("Websocket has not been connected yet");
    return ws;
  }

  private set ws(newWs: WebSocket) {
    const isAlreadySet = this._ws;
    if (isAlreadySet) throw new Error("Websocket has already been connected");
    this._ws = newWs;
  }

  constructor(public readonly roomData: RoomData) {}

  connect() {
    const fullRoomWsUrl = this.getFullUrl();
    this.ws = new WebSocket(fullRoomWsUrl);
    this.setupWs();
  }

  private getFullUrl() {
    const { wsUrl, roomId, memberId, nonce } = this.roomData;
    const authParams = new URLSearchParams({ roomId, memberId, nonce });
    return `${wsUrl}?${authParams.toString()}`;
  }

  private setupWs() {
    this.setupAutoClose();
    this.setupRoomWsEventListeners();
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
  public addMessageActionHandler(handler: MessageActionHandler) {
    this.messageActionHandlers[handler.action] = handler;
    return this;
  }
}

export default RoomWs;
