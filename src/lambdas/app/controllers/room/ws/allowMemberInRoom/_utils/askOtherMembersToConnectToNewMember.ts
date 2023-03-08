import wsBackendForApp from "@appLambda/utils/wsBackend";
import { RoomDocument } from "models/Room/index.model";
import { RoomMember } from "models/Room/schemas/member/index.schema";

type MemberId = RoomMember["memberId"];
type ConnectionId = NonNullable<RoomMember["connectionId"]>;

async function askOtherMembersToConnectToNewMember(
  requestedRoom: RoomDocument,
  newMemberId: MemberId
) {
  const otherMembersConnectionIds = getOtherMembersConnectionIds(
    requestedRoom,
    newMemberId
  );
  await sendPromptsToOpenNewConnection(otherMembersConnectionIds, newMemberId);
}

function getOtherMembersConnectionIds(
  requestedRoom: RoomDocument,
  newMemberId: MemberId
) {
  const allowedMembers = requestedRoom.getAllowedMembers();
  const otherMembers = allowedMembers.filter(
    (member) => member.memberId !== newMemberId
  );
  return otherMembers.map((member) => member.connectionId);
}

async function sendPromptsToOpenNewConnection(
  connectionIds: ConnectionId[],
  newMemberId: RoomMember["memberId"]
) {
  const connectionToNewConnectionPrompt = async (
    connectionId: ConnectionId
  ) => {
    const msg = { action: "promptSdp", payload: { newMemberId } };
    await wsBackendForApp.sendMsgToWs(connectionId, msg);
  };
  const newConnectionPrompts = connectionIds.map(
    connectionToNewConnectionPrompt
  );
  return Promise.all(newConnectionPrompts);
}

export default askOtherMembersToConnectToNewMember;
