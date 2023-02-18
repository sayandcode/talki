import { RoomDocument } from "models/Room/index.model";
import { getIsMemberConnected } from "models/Room/schemas/member/helperFns";
import { RoomMember } from "models/Room/schemas/member/index.schema";

function getIsRoomReadyToAcceptMembers(
  requestedRoom: RoomDocument,
  requestingMemberId: RoomMember["memberId"]
) {
  const adminMember = requestedRoom.getAdminMember();
  const isThisRequestNotFromAdmin = adminMember.memberId !== requestingMemberId;
  const isAdminNotConnected = !getIsMemberConnected(adminMember);
  return isThisRequestNotFromAdmin && isAdminNotConnected;
}

export default getIsRoomReadyToAcceptMembers;
