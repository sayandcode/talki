import APP_ENV_VARS from "@appLambda/env";
import WsBackend from "@utils/WsBackend";
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
    (member) => member.memberId === newMemberId
  );
  return otherMembers.map((member) => member.connectionId);
}

const wsUrl = APP_ENV_VARS.ROOM_WS_URL;
const wsBackend = new WsBackend(wsUrl);

async function sendPromptsToOpenNewConnection(
  connectionIds: ConnectionId[],
  newMemberId: RoomMember["memberId"]
) {
  const connectionToNewConnectionPrompt = async (
    connectionId: ConnectionId
  ) => {
    const msg = { action: "sendConnectionOffer", payload: { newMemberId } };
    await wsBackend.sendMsgToWs(connectionId, msg);
  };
  const newConnectionPrompts = connectionIds.map(
    connectionToNewConnectionPrompt
  );
  return Promise.all(newConnectionPrompts);
}

export default askOtherMembersToConnectToNewMember;
