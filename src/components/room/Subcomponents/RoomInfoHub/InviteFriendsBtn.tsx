import {
  ROOM_EXPIRY_CONTAINER_ID,
  ROOM_INVITE_FRIENDS_BTN_ID,
} from "scripts/pages/room/pageManip/roomId";
import InviteFriendsModal from "./InviteFriendsModal/index";

function RoomPageInviteFriendsBtn() {
  return (
    <>
      <button
        id={ROOM_INVITE_FRIENDS_BTN_ID}
        hidden
        class="ml-2 text-sm font-semibold bg-white focus-visible:bg-gray-200 hover:bg-gray-200 px-2 py-1"
      >
        Invite friends
        <br />
        <span class="font-thin text-xs">
          Expires in
          <span
            id={ROOM_EXPIRY_CONTAINER_ID}
            class="font-extrabold text-sm"
          ></span>
        </span>
      </button>
      <InviteFriendsModal />
    </>
  );
}

export default RoomPageInviteFriendsBtn;

// <script>
//   import { INVITE_FRIENDS_MODAL_ID } from "scripts/pages/room/pageManip/InviteFriendsModal";
//   import { ROOM_INVITE_FRIENDS_BTN_ID } from "scripts/pages/room/pageManip/roomId";
//   import getElById from "utils/functions/getElById";

//   const btn = getElById(ROOM_INVITE_FRIENDS_BTN_ID);
//   const dialogEl = getElById<HTMLDialogElement>(INVITE_FRIENDS_MODAL_ID);

//   btn.addEventListener("click", () => {
//     dialogEl.showModal();
//   });
// </script>
