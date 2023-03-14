import { RoomDocument } from "models/Room/index.model";
import { getIsMemberConnected } from "models/Room/schemas/member/helperFns";
import { RoomMember } from "models/Room/schemas/member/index.schema";

function getIsRoomReadyToAcceptMembers(
  requestedRoom: RoomDocument,
  requestingMemberId: RoomMember["memberId"]
) {
  const adminMember = requestedRoom.getAdminMember();
  const isThisRequestFromAdmin = adminMember.memberId === requestingMemberId;
  const isAdminConnected = getIsMemberConnected(adminMember);
  return isThisRequestFromAdmin || isAdminConnected;
}

export default getIsRoomReadyToAcceptMembers;
