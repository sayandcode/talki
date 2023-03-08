import wsBackendForApp from "@appLambda/utils/wsBackend";
import { AllowedRoomMember } from "models/Room/schemas/member/index.schema";

async function sendRoomWsPromptIceCandidate({
  receiverMember,
  senderMember,
}: {
  receiverMember: AllowedRoomMember;
  senderMember: AllowedRoomMember;
}) {
  const receiverConnectionId = receiverMember.connectionId;
  const msg = getMsg(senderMember);
  await wsBackendForApp.sendMsgToWs(receiverConnectionId, msg);
}

function getMsg(senderMember: AllowedRoomMember) {
  const { memberId: senderMemberId } = senderMember;
  return {
    action: "promptIceCandidate",
    payload: { senderMemberId },
  };
}

export default sendRoomWsPromptIceCandidate;
