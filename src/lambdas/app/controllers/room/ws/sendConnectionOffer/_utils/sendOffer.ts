import wsBackendForApp from "@appLambda/utils/wsBackend";
import { AllowedRoomMember } from "models/Room/schemas/member/index.schema";
import { WebRtcTypes } from "../../_utils/webRtc";

async function sendRoomWsRTCOffer({
  offeringMember: requestingMember,
  answeringMember: newMember,
  offerSdp,
}: {
  offeringMember: AllowedRoomMember;
  answeringMember: AllowedRoomMember;
  offerSdp: WebRtcTypes["Sdp"];
}) {
  const newMemberConnectionId = newMember.connectionId;
  const msg = getMsg(requestingMember, offerSdp);
  await wsBackendForApp.sendMsgToWs(newMemberConnectionId, msg);
}

function getMsg(
  requestingMember: AllowedRoomMember,
  offerSdp: WebRtcTypes["Sdp"]
) {
  return {
    action: "sendConnectionAnswer",
    payload: {
      offererMemberId: requestingMember.memberId,
      offerSdp,
    },
  };
}

export default sendRoomWsRTCOffer;
