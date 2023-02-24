import getElById from "utils/functions/getElById";
import type { RoomUserData } from "utils/types/Room";

const ENTRY_DIALOG_ID = "entry-dialog";
const ENTRY_DIALOG_USERNAME_ID = "entry-dialog-username";
const ENTRY_DIALOG_VERIFIED_ID = "entry-dialog-verified";
const ENTRY_DIALOG_NOT_VERIFIED_ID = "entry-dialog-not-verified";
const ENTRY_DIALOG_BTN_CONTAINER_ID = "entry-dialog-btn-container";
const ENTRY_DIALOG_DENY_BTN_ID = "entry-dialog-deny-btn";
const ENTRY_DIALOG_ALLOW_BTN_ID = "entry-dialog-allow-btn";

type IsAllowed = boolean;

// eslint-disable-next-line no-unused-vars
type PermissionCallback = (isAllowed: IsAllowed) => void;

function showEntryPermissionDialog(
  userData: RoomUserData,
  callback: PermissionCallback
) {
  const dialogEl = getElById<HTMLDialogElement>(ENTRY_DIALOG_ID);

  const usernameEl = getElById(ENTRY_DIALOG_USERNAME_ID);
  usernameEl.textContent = userData.username;

  showVerifiedEl(userData.verified);
  setupBtnListeners(callback, dialogEl);

  dialogEl.showModal();
}

function showVerifiedEl(isVerified: boolean) {
  const verifiedEl = getElById(ENTRY_DIALOG_VERIFIED_ID);
  const notVerifiedEl = getElById(ENTRY_DIALOG_NOT_VERIFIED_ID);
  verifiedEl.style.display = "none";
  notVerifiedEl.style.display = "none";
  (isVerified ? verifiedEl : notVerifiedEl).style.display = "block";
}

function setupBtnListeners(
  callback: PermissionCallback,
  dialogEl: HTMLDialogElement
) {
  const btnContainer = getElById(ENTRY_DIALOG_BTN_CONTAINER_ID);
  const denyBtn = getElById(ENTRY_DIALOG_DENY_BTN_ID);
  const allowBtn = getElById(ENTRY_DIALOG_ALLOW_BTN_ID);

  // removing old listeners
  const newDenyBtn = replaceEl(denyBtn, btnContainer);
  const newAllowBtn = replaceEl(allowBtn, btnContainer);

  const handleClick = (isAllowed: IsAllowed) => {
    callback(isAllowed);
    dialogEl.close();
  };
  newDenyBtn.addEventListener("click", () => handleClick(false));
  newAllowBtn.addEventListener("click", () => handleClick(true));
}

function replaceEl(oldEl: HTMLElement, container: HTMLElement) {
  const newEl = oldEl.cloneNode(true);
  container.replaceChild(newEl, oldEl);
  oldEl.remove();
  return newEl;
}

export default showEntryPermissionDialog;
export {
  ENTRY_DIALOG_USERNAME_ID,
  ENTRY_DIALOG_ID,
  ENTRY_DIALOG_VERIFIED_ID,
  ENTRY_DIALOG_NOT_VERIFIED_ID,
  ENTRY_DIALOG_ALLOW_BTN_ID,
  ENTRY_DIALOG_DENY_BTN_ID,
  ENTRY_DIALOG_BTN_CONTAINER_ID,
};
