import RoomModelValidators from "models/Room/index.validator";
import { z } from "zod";
import { WebRtcValidators } from "../../_utils/webRtc";

const RoomWsSendSdpBodyValidator = z.object({
  receiverMemberId: RoomModelValidators.memberId,
  sdp: WebRtcValidators.sdp,
});

export default RoomWsSendSdpBodyValidator;
