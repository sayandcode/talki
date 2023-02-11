import { RoomIdValidator } from "controllers/room/_utils/validators";
import { RoomId } from "models/Room/index.model";
import { RoomMemberSchemaType } from "models/Room/schemas/member";
import { z } from "zod";

const RoomWs$connectBodyValidator = z.object({
  connectionId: z.string(),
  roomId: RoomIdValidator,
  memberId: z.string(),
  nonce: z.string(),
});

type ConnectionId = NonNullable<RoomMemberSchemaType["connectionId"]>;
type MemberId = RoomMemberSchemaType["memberId"];
type Nonce = NonNullable<RoomMemberSchemaType["nonce"]>;

type RequiredRoomWs$connectBody = {
  connectionId: ConnectionId;
  roomId: RoomId;
  memberId: MemberId;
  nonce: Nonce;
};

export default RoomWs$connectBodyValidator;
export type { RequiredRoomWs$connectBody };
