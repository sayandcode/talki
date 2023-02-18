import APP_ENV_VARS from "@appLambda/env";
import WsBackend from "@utils/WsBackend";
import { RoomDocument } from "models/Room/index.model";
import { ConnectedRoomMember } from "models/Room/schemas/member/index.schema";

const wsUrl = APP_ENV_VARS.ROOM_WS_URL;
const wsBackend = new WsBackend(wsUrl);

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

export default processAdminDecisionOnNewMember;
