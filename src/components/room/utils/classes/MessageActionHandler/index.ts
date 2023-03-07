import type { z } from "zod";
import type RoomWs from "../RoomWs";

type RoomData = RoomWs["roomData"];

type PayloadHandler = (
  payload: unknown,
  roomData: RoomData,
  ws: RoomWs["ws"]
) => void;

class MessageActionHandler {
  private constructor(
    public readonly action: string,
    public handlePayload: PayloadHandler
  ) {}

  static construct<ValidatorSchema extends z.ZodSchema>(
    action: string,
    payloadValidator: ValidatorSchema,
    payloadHandlerTemplate: (
      pyld: z.infer<ValidatorSchema>,
      roomData: RoomData,
      ws: RoomWs["ws"]
    ) => void | Promise<void>
  ) {
    const handlePayload = (
      payload: unknown,
      roomData: RoomData,
      ws: RoomWs["ws"]
    ) => {
      const parsedPayload = payloadValidator.parse(payload);
      void payloadHandlerTemplate(parsedPayload, roomData, ws);
    };

    return new this(action, handlePayload);
  }
}

export default MessageActionHandler;
