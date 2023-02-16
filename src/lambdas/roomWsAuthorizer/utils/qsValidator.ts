import RoomModelValidators from "models/Room/index.validator";
import { z } from "zod";

const RoomWs$connectEventValidator = z.object({
  connectionId: RoomModelValidators.connectionId,
  roomId: RoomModelValidators.roomId,
  memberId: RoomModelValidators.memberId,
  nonce: RoomModelValidators.nonce,
});

export default RoomWs$connectEventValidator;
