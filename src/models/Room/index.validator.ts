import { z, ZodType } from "zod";
import { RoomId } from "./index.model";
import { RoomMemberSchemaType } from "./schemas/member";

type ConnectionId = NonNullable<RoomMemberSchemaType["connectionId"]>;
type MemberId = RoomMemberSchemaType["memberId"];
type Nonce = NonNullable<RoomMemberSchemaType["nonce"]>;

class RoomModelValidators {
  static readonly roomId = z.string().length(24) satisfies ZodType<RoomId>;

  static readonly connectionId = z.string() satisfies ZodType<ConnectionId>;

  static readonly memberId = z.string() satisfies ZodType<MemberId>;

  static readonly nonce = z.string() satisfies ZodType<Nonce>;
}

export default RoomModelValidators;
