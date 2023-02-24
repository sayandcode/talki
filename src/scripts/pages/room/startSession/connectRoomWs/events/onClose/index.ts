import { redirectToInternalUrl } from "utils/functions/redirects";
import type { RoomExpireAt } from "utils/types/Room";

function getRoomWsOnCloseHandler({ expireAt }: { expireAt: RoomExpireAt }) {
  return () => {
    const now = new Date().getTime();
    const scheduledExpiryTime = new Date(expireAt).getTime();
    if (now < scheduledExpiryTime) redirectToInternalUrl("/room/exit");
  };
}
export default getRoomWsOnCloseHandler;
