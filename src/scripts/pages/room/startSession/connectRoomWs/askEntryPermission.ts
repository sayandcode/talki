import showEntryPermissionDialog from "scripts/components/room/EntryPermissionDialog";
import RoomValidators, { RoomId } from "utils/types/Room";
import { z } from "zod";

const PayloadValidator = z.object({
  newMemberId: RoomValidators.RoomMemberId,
  userData: RoomValidators.RoomUserData,
});
/**
 * If the user receives this message, that means that the backend thinks
 * we are the admin for this room. Hence you can reply confidently whether
 * or not you wish to add the specified member in the room
 */
function askEntryPermissionToUser({
  payload,
  roomWs,
  roomId,
}: {
  payload: unknown;
  roomWs: WebSocket;
  roomId: RoomId;
}) {
  const validation = PayloadValidator.safeParse(payload);
  if (!validation.success)
    throw new Error(
      "Entry permission payload did not contain the expected data"
    );

  const { userData, newMemberId } = validation.data;
  showEntryPermissionDialog(userData, (isAllowed) => {
    const msg = {
      action: "allowMemberInRoom",
      payload: {
        isAllowedInRoom: isAllowed,
        newMemberId,
        roomId,
      },
    };
    roomWs.send(JSON.stringify(msg));
  });
}

export default askEntryPermissionToUser;
