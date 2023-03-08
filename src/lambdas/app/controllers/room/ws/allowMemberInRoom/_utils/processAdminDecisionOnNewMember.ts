import wsBackendForApp from "@appLambda/utils/wsBackend";
import { RoomDocument } from "models/Room/index.model";
import { ConnectedRoomMember } from "models/Room/schemas/member/index.schema";

async function processAdminDecisionOnNewMember({
  isNewMemberAllowedInRoomByAdmin,
  requestedRoom,
  newMember,
}: {
  isNewMemberAllowedInRoomByAdmin: boolean;
  requestedRoom: RoomDocument;
  newMember: ConnectedRoomMember;
}) {
  if (!isNewMemberAllowedInRoomByAdmin) {
    requestedRoom.members.delete(newMember.memberId);
    await wsBackendForApp.deleteConnection(newMember.connectionId);
  } else {
    // eslint-disable-next-line no-param-reassign
    newMember.isAllowedInRoom = true;
  }
  await requestedRoom.save();
}

export default processAdminDecisionOnNewMember;
