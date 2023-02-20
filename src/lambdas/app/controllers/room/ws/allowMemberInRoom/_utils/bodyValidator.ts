import { z } from "zod";
import RoomModelValidators from "models/Room/index.validator";

const RoomWsAllowMemberInRoomBodyValidator = z.object({
  isAllowedInRoom: z.boolean(),
  newMemberId: RoomModelValidators.memberId,
});

export default RoomWsAllowMemberInRoomBodyValidator;
