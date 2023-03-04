import getElById from "utils/functions/getElById";
import type { RoomId } from "utils/types/Room";

const INVITE_FRIENDS_MODAL_ID = "invite-friends-modal";
const INVITE_FRIENDS_MODAL_CONTENT_ID = "invite-friends-modal-content";
const INVITE_FRIENDS_CLOSE_BTN = "invite-friends-modal-close-btn";
const INVITE_FRIENDS_URL_COMPONENT_TEXT_ID =
  "invite-friends-modal-url-component-text";
const INVITE_FRIENDS_URL_COMPONENT_COPY_BTN_ID =
  "invite-friends-modal-url-component-copy-btn";

function setupCloseListeners() {
  const dialogEl = getElById<HTMLDialogElement>(INVITE_FRIENDS_MODAL_ID);
  const contentEl = getElById<HTMLDivElement>(INVITE_FRIENDS_MODAL_CONTENT_ID);
  const closeBtn = getElById<HTMLButtonElement>(INVITE_FRIENDS_CLOSE_BTN);

  contentEl.addEventListener("click", (e) => {
    e.stopPropagation();
  });
  dialogEl.addEventListener("click", () => {
    dialogEl.close();
  });
  closeBtn.addEventListener("click", () => {
    dialogEl.close();
  });
}

function setRoomIdInCopyUrlComponent(roomId: RoomId) {
  const finalUrl = getCurrUrlWithRequiredRoomId(window.location.href);

  const textEl = getElById(INVITE_FRIENDS_URL_COMPONENT_TEXT_ID);
  const copyBtnEl = getElById<HTMLButtonElement>(
    INVITE_FRIENDS_URL_COMPONENT_COPY_BTN_ID
  );

  textEl.dataset.url = finalUrl;
  copyBtnEl.dataset.url = finalUrl;

  function getCurrUrlWithRequiredRoomId(currUrl: string) {
    const result = new URL(currUrl);
    result.searchParams.set("roomId", roomId);
    return result.toString();
  }
}

export {
  setupCloseListeners,
  setRoomIdInCopyUrlComponent,
  INVITE_FRIENDS_MODAL_ID,
  INVITE_FRIENDS_MODAL_CONTENT_ID,
  INVITE_FRIENDS_CLOSE_BTN,
  INVITE_FRIENDS_URL_COMPONENT_TEXT_ID,
  INVITE_FRIENDS_URL_COMPONENT_COPY_BTN_ID,
};
