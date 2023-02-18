import { z, ZodType } from "zod";
import { RoomId } from "./index.model";
import { RoomMember } from "./schemas/member";

type ConnectionId = NonNullable<RoomMember["connectionId"]>;
type MemberId = RoomMember["memberId"];
type Nonce = NonNullable<RoomMember["nonce"]>;

class RoomModelValidators {
  static readonly roomId = z.string().length(24) satisfies ZodType<RoomId>;

  static readonly connectionId = z.string() satisfies ZodType<ConnectionId>;

  static readonly memberId = z.string() satisfies ZodType<MemberId>;

  static readonly nonce = z.string() satisfies ZodType<Nonce>;
}

export default RoomModelValidators;
