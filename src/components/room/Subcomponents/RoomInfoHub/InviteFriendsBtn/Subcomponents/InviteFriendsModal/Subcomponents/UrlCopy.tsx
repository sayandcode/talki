import type { RoomId } from "utils/types/Room";
import myImg from "./link.svg";

type Props = {
  roomId: RoomId;
};

function RoomPageInviteFriendsModalUrlCopy({ roomId }: Props) {
  const roomUrl = getRoomUrl(roomId);

  return (
    <div class="flex flex-col sm:flex-row mb-4">
      <div class="bg-gray-50 border-2 border-gray-300 p-2 text-sm after:content-[attr(data-url)] break-all">
        {roomUrl}
      </div>
      <button
        class="bg-talki-green-400 hover:bg-talki-green-600 flex items-center justify-center"
        onClick={() => copyTextToClipBoard(roomUrl)}
      >
        <img src={myImg} class="h-10 w-10" />
        <span class="pr-4"> Copy Link</span>
      </button>
    </div>
  );
}

function getRoomUrl(roomId: RoomId) {
  const url = new URL(window.location.href);
  url.searchParams.set("roomId", roomId);
  return url.toString();
}

async function copyTextToClipBoard(text: string) {
  await navigator.clipboard.writeText(text);
}

export default RoomPageInviteFriendsModalUrlCopy;
