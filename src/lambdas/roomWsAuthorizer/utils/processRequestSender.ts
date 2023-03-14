import askOtherMembersToConnectToNewMember from "@utils/askOtherMembersToConnectToNewMember";
import { RoomDocument } from "models/Room/index.model";
import { RoomMember } from "models/Room/schemas/member/index.schema";
import AdminNotifier from "./AdminNotifier";
import parseRoomWsAuthorizerEventData from "./eventData";
import wsBackendForRoomWsAuthorizer from "./wsBackend";

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

  const memberAlreadyInRoom = requestedRoom.members.get(requestingMemberId);
  if (!memberAlreadyInRoom) return false;

  const isReqVerified = requestedRoom.verifyNonce(requestingMemberId, nonce);
  if (!isReqVerified) return false;

  await requestedRoom.confirmConnection(requestingMemberId, connectionId);

  if (memberAlreadyInRoom.isAllowedInRoom)
    await askOtherMembersToConnectToNewMember(
      requestedRoom,
      requestingMemberId,
      wsBackendForRoomWsAuthorizer
    );
  else await notifyAdmin(requestedRoom, requestingMemberId);

  return true;
}

async function notifyAdmin(
  requestedRoom: RoomDocument,
  requestingMemberId: RoomMember["memberId"]
) {
  await new AdminNotifier(
    requestingMemberId,
    requestedRoom
  ).notifyAboutNewMember();
}

export default processRoomWsAuthorizerRequestSender;
