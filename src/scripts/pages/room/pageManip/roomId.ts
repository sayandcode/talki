import getElById from "utils/functions/getElById";
import type { RoomExpireAt, RoomId } from "utils/types/Room";

const ROOM_ID_CONTAINER_ID = "room-id-container";
const ROOM_EXPIRY_CONTAINER_ID = "room-expiry-time";
const ROOM_INVITE_FRIENDS_BTN_ID = "room-invite-friends-btn";
const ROOM_ID_SPINNER_ID = "roomId-spinner";

function setRoomIdOnPage(roomId: RoomId) {
  const roomIdSpan = getElById(ROOM_ID_CONTAINER_ID);
  roomIdSpan.textContent = roomId;
}

function setRoomExpiryOnPage(expireAt: RoomExpireAt) {
  const expiryTime = new Date(expireAt);
  const intervalRef = setInterval(() => {
    updateExpiryTime(expiryTime);
    if (Date.now() > expiryTime.getTime()) clearInterval(intervalRef);
  }, 1000);
}

function updateExpiryTime(expiryTime: Date) {
  const roomExpirySpan = getElById(ROOM_EXPIRY_CONTAINER_ID);
  const secondsToExpiry = getSecondsToExpiry(expiryTime);
  const remainingTimeStr = getRemainingTimeStr(secondsToExpiry);
  roomExpirySpan.textContent = remainingTimeStr;
}

function getSecondsToExpiry(expiryTime: Date) {
  return Math.floor((expiryTime.getTime() - Date.now()) / 1000);
}

function getRemainingTimeStr(secondsToExpiry: number) {
  const remainingMin = Math.floor(secondsToExpiry / 60);
  const remainingSec = secondsToExpiry % 60;
  const formattedRemainingSec =
    remainingSec < 10 ? `0${remainingSec}` : remainingSec;
  return `${remainingMin}:${formattedRemainingSec}`;
}

function switchSpinnerWithRoomIdData() {
  const spinnerEl = getElById(ROOM_ID_SPINNER_ID);
  const inviteFriendsBtn = getElById(ROOM_INVITE_FRIENDS_BTN_ID);
  const roomIdEl = getElById(ROOM_ID_CONTAINER_ID);

  spinnerEl.hidden = true;
  inviteFriendsBtn.hidden = false;
  roomIdEl.hidden = false;
}

export {
  setRoomIdOnPage,
  setRoomExpiryOnPage,
  switchSpinnerWithRoomIdData,
  ROOM_ID_CONTAINER_ID,
  ROOM_EXPIRY_CONTAINER_ID,
  ROOM_INVITE_FRIENDS_BTN_ID,
  ROOM_ID_SPINNER_ID,
};
