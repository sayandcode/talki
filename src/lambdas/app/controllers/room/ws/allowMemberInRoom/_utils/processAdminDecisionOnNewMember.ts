import wsBackendForApp from "@appLambda/utils/wsBackend";
import { RoomDocument } from "models/Room/index.model";
import { ConnectedRoomMember } from "models/Room/schemas/member/index.schema";
import askOtherMembersToConnectToNewMember from "@utils/askOtherMembersToConnectToNewMember";

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
    await askOtherMembersToConnectToNewMember(
      requestedRoom,
      newMember.memberId,
      wsBackendForApp
    );
  }
  await requestedRoom.save();
}

export default processAdminDecisionOnNewMember;
