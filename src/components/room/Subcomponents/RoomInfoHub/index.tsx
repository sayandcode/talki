import { useEffect, useState } from "preact/hooks";
import type { RoomExpireAt, RoomId } from "utils/types/Room";
import InviteFriendsBtn from "./InviteFriendsBtn";

type Props = {
  roomId: RoomId | undefined;
  expireAt: RoomExpireAt | undefined;
};
function RoomPageRoomInfoHub({ roomId, expireAt }: Props) {
  const [isComponentShown, setIsComponentShown] = useState(true);

  const autoHideRoomInfoHubOnExpire = {
    setup: (expiryTimeIsoString: RoomExpireAt) => {
      const expiryTime = new Date(expiryTimeIsoString);
      const secondsToExpiry = getSecondsToExpiry(expiryTime);
      const timeoutRef = setTimeout(() => {
        setIsComponentShown(false);
      }, secondsToExpiry * 1000);
      return timeoutRef;
    },
    cleanup: (timeoutRef: number) => clearTimeout(timeoutRef),
  };

  useEffect(() => {
    if (!expireAt) return;
    const timeoutRef = autoHideRoomInfoHubOnExpire.setup(expireAt);
    // eslint-disable-next-line consistent-return
    return () => autoHideRoomInfoHubOnExpire.cleanup(timeoutRef);
  }, [expireAt]);

  function getSecondsToExpiry(expiryTime: Date) {
    return Math.floor((expiryTime.getTime() - Date.now()) / 1000);
  }

  if (!isComponentShown) return null;
  return (
    <div class="text-lg font-mono pb-2 text-center align-top flex flex-wrap sm:flex-row justify-center items-center gap-1">
      <div class="whitespace-nowrap">Room ID:</div>
      {roomId && expireAt ? (
        <>
          <div class="font-bold">{roomId}</div>
          <InviteFriendsBtn roomId={roomId} expireAt={expireAt} />
        </>
      ) : (
        <img src="/talki/loadingSpinner.gif" class="h-6 pb-1 pl-1" />
      )}
    </div>
  );
}
export default RoomPageRoomInfoHub;
