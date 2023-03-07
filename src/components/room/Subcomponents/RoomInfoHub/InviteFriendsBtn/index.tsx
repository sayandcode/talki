import { useCallback, useEffect, useState } from "preact/hooks";
import type { RoomExpireAt, RoomId } from "utils/types/Room";
import {
  InviteFriendsBtnGetSecondsToExpiry as getSecondsToExpiry,
  InviteFriendsBtnGetTimeLeftStr as getTimeLeftStr,
  InviteFriendsBtnRunEverySecondTillExpiry as runEverySecondTillExpiry,
} from "./helperFns";
import InviteFriendsModal from "./Subcomponents/InviteFriendsModal";

type Props = {
  roomId: RoomId;
  expireAt: RoomExpireAt;
};

function RoomPageInviteFriendsBtn({ roomId, expireAt }: Props) {
  // time left
  const [timeLeftStr, setTimeLeftStr] = useState("5:00");

  useEffect(() => {
    const cleanupRefs = runEverySecondTillExpiry.setup(
      expireAt,
      updateTimeLeftStr
    );
    return () => runEverySecondTillExpiry.cleanup(cleanupRefs);
  }, [expireAt]);

  function updateTimeLeftStr() {
    const expiryTime = new Date(expireAt);
    const secondsToExpiry = getSecondsToExpiry(expiryTime);
    const newTimeLeftStr = getTimeLeftStr(secondsToExpiry);
    setTimeLeftStr(newTimeLeftStr);
  }

  // modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return (
    <>
      <button
        class="ml-2 text-sm font-semibold bg-white focus-visible:bg-gray-200 hover:bg-gray-200 px-2 py-1"
        onClick={() => setIsModalOpen(true)}
      >
        Invite friends
        <br />
        <span class="font-thin text-xs">Expires in {timeLeftStr}</span>
      </button>
      <InviteFriendsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        roomId={roomId}
      />
    </>
  );
}

export default RoomPageInviteFriendsBtn;
