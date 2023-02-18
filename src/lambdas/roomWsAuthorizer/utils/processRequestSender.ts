import { RoomDocument } from "models/Room/index.model";
import { RoomMember } from "models/Room/schemas/member/index.schema";
import AdminNotifier from "./AdminNotifier";
import parseRoomWsAuthorizerEventData from "./eventData";

type ParseResult = ReturnType<typeof parseRoomWsAuthorizerEventData>;
type SuccessfulParseResult = ParseResult & {
  success: true;
};
type EventData = SuccessfulParseResult["data"];

/**
 * @returns Whether or not the requesting member is allowed into the room
 */
async function processRoomWsAuthorizerRequestSender(
  requestedRoom: RoomDocument,
  eventData: EventData
) {
  const { memberId: requestingMemberId, connectionId, nonce } = eventData;

  const isReqVerified = requestedRoom.verifyNonce(requestingMemberId, nonce);
  if (!isReqVerified) return false;

  await requestedRoom.confirmConnection(requestingMemberId, connectionId);
  await notifyAdminIfNecessary(requestedRoom, requestingMemberId);

  return true;
}

async function notifyAdminIfNecessary(
  requestedRoom: RoomDocument,
  requestingMemberId: RoomMember["memberId"]
) {
  const adminMember = requestedRoom.getAdminMember();
  const isThisRequestNotFromAdmin = adminMember.memberId !== requestingMemberId;
  if (isThisRequestNotFromAdmin)
    await new AdminNotifier(
      requestingMemberId,
      requestedRoom
    ).notifyAboutNewMember();
}

export default processRoomWsAuthorizerRequestSender;
