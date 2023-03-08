import RoomModelValidators from "models/Room/index.validator";
import { z } from "zod";

const RoomWsPromptIceCandidateBodyValidator = z.object({
  receiverMemberId: RoomModelValidators.memberId,
});

export default RoomWsPromptIceCandidateBodyValidator;
