import showEntryPermissionDialog from "scripts/components/room/EntryPermissionDialog";
import RoomValidators from "utils/types/Room";
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
function askEntryPermissionToUser(payload: unknown) {
  const validation = PayloadValidator.safeParse(payload);
  if (!validation.success)
    throw new Error(
      "Entry permission payload did not contain the expected data"
    );

  const { userData, newMemberId } = validation.data;
  showEntryPermissionDialog(userData, (isAllowed) => {
    const decision = isAllowed ? "allowed" : "denied";
    const msg = `Admin ${decision} the user`;
    console.log(msg, newMemberId); // send this permission to the websocket
  });
}

export default askEntryPermissionToUser;
