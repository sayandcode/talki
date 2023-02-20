import wsBackendForApp from "@appLambda/utils/wsBackend";
import { AllowedRoomMember } from "models/Room/schemas/member/index.schema";
import { WebRtcTypes } from "../../_utils/webRtc";

async function sendRoomWsSdp({
  receiverMember,
  senderMember,
  sdp,
}: {
  receiverMember: AllowedRoomMember;
  senderMember: AllowedRoomMember;
  sdp: WebRtcTypes["Sdp"];
}) {
  const receiverConnectionId = receiverMember.connectionId;
  const msg = getMsg(senderMember, sdp);
  await wsBackendForApp.sendMsgToWs(receiverConnectionId, msg);
}

function getMsg(senderMember: AllowedRoomMember, sdp: WebRtcTypes["Sdp"]) {
  const { memberId: senderMemberId, userData: senderData } = senderMember;
  return {
    action: "sendSdp",
    payload: { senderMemberId, senderData, sdp },
  };
}

export default sendRoomWsSdp;
