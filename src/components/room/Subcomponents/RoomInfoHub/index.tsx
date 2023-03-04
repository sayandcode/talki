import {
  ROOM_ID_CONTAINER_ID,
  ROOM_DATA_BAR_ID,
  ROOM_ID_SPINNER_ID,
} from "scripts/pages/room/pageManip/roomId";
import InviteFriendsBtn from "./InviteFriendsBtn";

function RoomPageRoomInfoHub() {
  return (
    <div
      id={ROOM_DATA_BAR_ID}
      class="text-lg font-mono pb-2 text-center align-top flex flex-wrap sm:flex-row justify-center items-center gap-x-1"
    >
      <div class="whitespace-nowrap">Room ID:</div>
      <img
        id={ROOM_ID_SPINNER_ID}
        src="/talki/loadingSpinner.gif"
        class="h-6 pb-1 pl-1"
      />
      <div id={ROOM_ID_CONTAINER_ID} class="font-bold" hidden>
        sjflksjlkjldjoi3j3knlk93fs
      </div>
      <InviteFriendsBtn />
    </div>
  );
}
export default RoomPageRoomInfoHub;
