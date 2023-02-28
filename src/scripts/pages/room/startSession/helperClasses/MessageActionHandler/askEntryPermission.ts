import showEntryPermissionDialog from "scripts/components/room/EntryPermissionDialog";
import RoomValidators from "utils/types/Room";
import { z } from "zod";
import MessageActionHandler from ".";

const PayloadValidator = z.object({
  newMemberId: RoomValidators.RoomMemberId,
  userData: RoomValidators.RoomUserData,
});

/**
 * If the user receives this message, that means that the backend thinks
 * we are the admin for this room. Hence you can reply confidently whether
 * or not you wish to add the specified member in the room
 */
const askEntryPermissionActionHandler = MessageActionHandler.construct(
  "askEntryPermission",
  PayloadValidator,
  (payload, roomData, roomWs) => {
    const { userData, newMemberId } = payload;

    showEntryPermissionDialog(userData, (isAllowed) => {
      const msg = {
        action: "allowMemberInRoom",
        payload: {
          isAllowedInRoom: isAllowed,
          newMemberId,
          roomId: roomData.roomId,
        },
      };
      roomWs.send(JSON.stringify(msg));
    });
  }
);

export default askEntryPermissionActionHandler;
