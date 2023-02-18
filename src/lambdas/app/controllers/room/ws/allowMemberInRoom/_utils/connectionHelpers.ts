import { RoomDocument } from "models/Room/index.model";
import { ConnectedRoomMember, RoomMember } from "models/Room/schemas/member";
import WsBackend from "@utils/WsBackend";
import APP_ENV_VARS from "@appLambda/env";

type ConnectionId = NonNullable<RoomMember["connectionId"]>;

const wsUrl = APP_ENV_VARS.ROOM_WS_URL;
const wsBackend = new WsBackend(wsUrl);

/**
 * Other members refers to other "allowed" members
 */
function getOtherAllowedMembersConnectionIds(
  requestedRoom: RoomDocument,
  newMemberId: RoomMember["memberId"]
): ConnectionId[] {
  const connectionIdsToSendNewConnectionPrompt: string[] = [];
  for (const member of requestedRoom.members.values()) {
    const isOtherAllowedMemberInRoom =
      member.memberId === newMemberId && member.isAllowedInRoom;
    if (!isOtherAllowedMemberInRoom) break;
    if (!member.connectionId)
      throw new Error("Allowed member doesn't have a connectionId");
    connectionIdsToSendNewConnectionPrompt.push(member.connectionId);
  }
  return connectionIdsToSendNewConnectionPrompt;
}

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

async function processAdminDecisionOnNewMember({
  isNewMemberAllowedInRoom,
  requestedRoom,
  newMember,
}: {
  isNewMemberAllowedInRoom: boolean;
  requestedRoom: RoomDocument;
  newMember: ConnectedRoomMember;
}) {
  if (!isNewMemberAllowedInRoom) {
    requestedRoom.members.delete(newMember.memberId);
    await wsBackend.deleteConnection(newMember.connectionId);
  } else {
    // eslint-disable-next-line no-param-reassign
    newMember.isAllowedInRoom = true;
  }
  await requestedRoom.save();
}

function getIsConnectionIdSameAsAdmin(
  requestedRoom: RoomDocument,
  senderConnectionId: ConnectionId
) {
  const senderMember =
    requestedRoom.getMemberFromConnectionId(senderConnectionId);
  const isSenderTheAdmin =
    senderMember && senderMember.memberId === requestedRoom.adminMemberId;
  return isSenderTheAdmin;
}

export {
  getOtherAllowedMembersConnectionIds,
  sendPromptsToOpenNewConnection,
  processAdminDecisionOnNewMember,
  getIsConnectionIdSameAsAdmin,
};
