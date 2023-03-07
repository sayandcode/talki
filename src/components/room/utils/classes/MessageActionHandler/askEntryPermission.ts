import RoomValidators, { RoomUserData } from "utils/types/Room";
import { z } from "zod";
import MessageActionHandler from ".";

const PayloadValidator = z.object({
  newMemberId: RoomValidators.RoomMemberId,
  userData: RoomValidators.RoomUserData,
});

type ProcessEntryFn = (isAllowed: boolean) => void;

type PromptUserForPermission = ({
  userData,
  processEntry,
}: {
  userData: RoomUserData;
  processEntry: ProcessEntryFn;
}) => void;

/**
 * If the user receives this message, that means that the backend thinks
 * we are the admin for this room. Hence you can reply confidently whether
 * or not you wish to add the specified member in the room
 */
function makeAskEntryPermissionActionHandler(
  promptUserForPermission: PromptUserForPermission
) {
  return MessageActionHandler.construct(
    "askEntryPermission",
    PayloadValidator,
    (payload, roomData, roomWs) => {
      const { userData, newMemberId } = payload;
      promptUserForPermission({
        userData,
        processEntry: (isAllowed) => {
          const msg = {
            action: "allowMemberInRoom",
            payload: {
              isAllowedInRoom: isAllowed,
              newMemberId,
              roomId: roomData.roomId,
            },
          };
          roomWs.send(JSON.stringify(msg));
        },
      });
    }
  );
}

export default makeAskEntryPermissionActionHandler;
