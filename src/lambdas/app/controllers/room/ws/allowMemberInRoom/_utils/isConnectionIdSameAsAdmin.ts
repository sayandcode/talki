import { RoomDocument } from "models/Room/index.model";
import { RoomMember } from "models/Room/schemas/member/index.schema";

function getIsConnectionIdSameAsAdmin(
  requestedRoom: RoomDocument,
  senderConnectionId: NonNullable<RoomMember["connectionId"]>
) {
  const senderMember =
    requestedRoom.getMemberFromConnectionId(senderConnectionId);
  const isSenderTheAdmin =
    senderMember && senderMember.memberId === requestedRoom.adminMemberId;
  return isSenderTheAdmin;
}

export default getIsConnectionIdSameAsAdmin;
