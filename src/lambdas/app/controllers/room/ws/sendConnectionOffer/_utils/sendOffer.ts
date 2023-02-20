import APP_ENV_VARS from "@appLambda/env";
import WsBackend from "@utils/WsBackend";
import { AllowedRoomMember } from "models/Room/schemas/member/index.schema";
import { WebRtcTypes } from "../../_utils/webRtc";

const wsUrl = APP_ENV_VARS.ROOM_WS_URL;
const wsBackend = new WsBackend(wsUrl);

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
  await wsBackend.sendMsgToWs(newMemberConnectionId, msg);
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
