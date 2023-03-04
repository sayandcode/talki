import RemoteStreamsManager from "scripts/pages/room/pageManip/RemoteStreamsManager";

function RoomPageRemoteVideosGrid() {
  return (
    <div class="w-full h-full bg-black">
      <div
        class="w-full h-full grid grid-rows-[repeat(var(--grid-cols),1fr)] sm:grid-rows-[repeat(var(--grid-rows),1fr)] grid-cols-[repeat(var(--grid-rows),1fr)] sm:grid-cols-[repeat(var(--grid-cols),1fr)]"
        id={RemoteStreamsManager.CONTAINERS_GRID_EL_ID}
      ></div>
    </div>
  );
}

export default RoomPageRemoteVideosGrid;
