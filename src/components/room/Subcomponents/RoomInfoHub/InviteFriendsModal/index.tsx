import {
  INVITE_FRIENDS_MODAL_ID,
  INVITE_FRIENDS_MODAL_CONTENT_ID,
  INVITE_FRIENDS_CLOSE_BTN,
} from "scripts/pages/room/pageManip/InviteFriendsModal";
import LinkAttribution from "./LinkAttribution";
import UrlCopy from "./UrlCopy";

function RoomPageInviteFriendsModal() {
  return (
    <dialog class="bg-transparent" id={INVITE_FRIENDS_MODAL_ID}>
      <div id={INVITE_FRIENDS_MODAL_CONTENT_ID} class="bg-white p-4">
        <div class="mb-2">
          <button
            id={INVITE_FRIENDS_CLOSE_BTN}
            aria-label="Close modal"
            class="float-right p-2 hover:bg-gray-100"
          >
            <img src="/talki/x-symbol.svg" class="h-4 w-4" />
          </button>
          <h1 class="font-bold">Invite friends to this room</h1>
        </div>
        <UrlCopy />
        <LinkAttribution />
      </div>
    </dialog>
  );
}

// <script>
//   import { setupCloseListeners } from "scripts/pages/room/pageManip/InviteFriendsModal";
//
//   setupCloseListeners();
// </script>
//
export default RoomPageInviteFriendsModal;
