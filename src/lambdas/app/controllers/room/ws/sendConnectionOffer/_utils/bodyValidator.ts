import RoomModelValidators from "models/Room/index.validator";
import { z } from "zod";
import { WebRtcValidators } from "../../_utils/webRtc";

const RoomWsSendConnectionOfferBodyValidator = z.object({
  newMemberId: RoomModelValidators.memberId,
  offerSdp: WebRtcValidators.sdp,
});

export default RoomWsSendConnectionOfferBodyValidator;
