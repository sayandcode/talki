import RoomModelValidators from "models/Room/index.validator";
import { z } from "zod";
import { WebRtcValidators } from "../../_utils/webRtc";

const RoomWsSendIceCandidateBodyValidator = z.object({
  receiverMemberId: RoomModelValidators.memberId,
  stringifiedIceCandidate: WebRtcValidators.stringifiedIceCandidate,
});

export default RoomWsSendIceCandidateBodyValidator;
