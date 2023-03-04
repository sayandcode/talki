import {
  INVITE_FRIENDS_URL_COMPONENT_TEXT_ID,
  INVITE_FRIENDS_URL_COMPONENT_COPY_BTN_ID,
} from "scripts/pages/room/pageManip/InviteFriendsModal";
import myImg from "./link.svg";

function RoomPageInviteFriendsModalUrlCopy() {
  // <script>
  //   import getElById from "utils/functions/getElById";
  //   import { INVITE_FRIENDS_URL_COMPONENT_COPY_BTN_ID } from "scripts/pages/room/pageManip/InviteFriendsModal";

  //   const btn = getElById<HTMLButtonElement>(
  //     INVITE_FRIENDS_URL_COMPONENT_COPY_BTN_ID
  //   );
  //   btn.addEventListener("click", () => {
  //     const urlText = btn.dataset.url;
  //     if (!urlText) throw new Error("No URL to copy to clipboard");
  //     navigator.clipboard.writeText(urlText);
  //   });
  // </script>

  return (
    <div class="flex flex-col sm:flex-row mb-4">
      <div
        id={INVITE_FRIENDS_URL_COMPONENT_TEXT_ID}
        data-url=""
        class="bg-gray-50 border-2 border-gray-300 p-2 text-sm after:content-[attr(data-url)] break-all"
      ></div>
      <button
        id={INVITE_FRIENDS_URL_COMPONENT_COPY_BTN_ID}
        class="bg-talki-green-400 hover:bg-talki-green-600 flex items-center justify-center"
      >
        <img src={myImg} class="h-10 w-10" />
        <span class="pr-4"> Copy Link</span>
      </button>
    </div>
  );
}

export default RoomPageInviteFriendsModalUrlCopy;
