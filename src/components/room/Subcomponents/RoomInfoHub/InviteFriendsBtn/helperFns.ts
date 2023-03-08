import type { RoomExpireAt } from "utils/types/Room";

const runEverySecondTillExpiry = {
  setup: (expiryTimeISOString: RoomExpireAt, updaterFn: () => void) => {
    const expiryTime = new Date(expiryTimeISOString);
    const intervalRef = setInterval(() => {
      const isRoomExpired = Date.now() > expiryTime.getTime();
      if (isRoomExpired) clearInterval(intervalRef);
      else updaterFn();
    }, 1000);
    return intervalRef;
  },
  cleanup: (intervalRef: number) => {
    clearInterval(intervalRef);
  },
};

function getSecondsToExpiry(expiryTime: Date) {
  return Math.floor((expiryTime.getTime() - Date.now()) / 1000);
}

function getTimeLeftStr(secondsToExpiry: number) {
  const remainingMin = Math.floor(secondsToExpiry / 60);
  const remainingSec = secondsToExpiry % 60;
  const formattedRemainingSec =
    remainingSec < 10 ? `0${remainingSec}` : remainingSec;
  return `${remainingMin}:${formattedRemainingSec}`;
}

export {
  runEverySecondTillExpiry as InviteFriendsBtnRunEverySecondTillExpiry,
  getSecondsToExpiry as InviteFriendsBtnGetSecondsToExpiry,
  getTimeLeftStr as InviteFriendsBtnGetTimeLeftStr,
};
