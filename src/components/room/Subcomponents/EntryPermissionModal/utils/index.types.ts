import type { RoomUserData } from "utils/types/Room";

type RoomPageEntryPermissionModalProps = {
  data: {
    userData: RoomUserData;
    processEntry: (isAllowed: boolean) => void | Promise<void>;
  } | null;
  onClose: () => void;
};

export default RoomPageEntryPermissionModalProps;
