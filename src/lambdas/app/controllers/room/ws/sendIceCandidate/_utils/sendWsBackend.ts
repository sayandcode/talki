import wsBackendForApp from "@appLambda/utils/wsBackend";
import { AllowedRoomMember } from "models/Room/schemas/member/index.schema";
import { WebRtcTypes } from "../../_utils/webRtc";

async function sendRoomWsIceCandidate({
  receiverMember,
  senderMember,
  stringifiedIceCandidate,
}: {
  receiverMember: AllowedRoomMember;
  senderMember: AllowedRoomMember;
  stringifiedIceCandidate: WebRtcTypes["StringifiedIceCandidate"];
}) {
  const receiverConnectionId = receiverMember.connectionId;
  const msg = getMsg(senderMember, stringifiedIceCandidate);
  await wsBackendForApp.sendMsgToWs(receiverConnectionId, msg);
}

function getMsg(
  senderMember: AllowedRoomMember,
  stringifiedIceCandidate: WebRtcTypes["StringifiedIceCandidate"]
) {
  const { memberId: senderMemberId } = senderMember;
  return {
    action: "sendIceCandidate",
    payload: { senderMemberId, stringifiedIceCandidate },
  };
}

export default sendRoomWsIceCandidate;
