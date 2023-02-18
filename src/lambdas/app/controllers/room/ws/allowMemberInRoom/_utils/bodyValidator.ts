import { z } from "zod";
import RoomModelValidators from "models/Room/index.validator";

const RoomWsAllowMemberInRoomBodyValidator = z.object({
  connectionId: RoomModelValidators.connectionId,
  isAllowedInRoom: z.boolean(),
  newMemberId: RoomModelValidators.memberId,
  roomId: RoomModelValidators.roomId,
});

export default RoomWsAllowMemberInRoomBodyValidator;
