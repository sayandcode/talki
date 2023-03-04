import EntryPermissionDialog from "./Subcomponents/EntryPermissionDialog";
import LeaveRoomBtn from "./Subcomponents/LeaveRoomBtn";
import RemoteVideosGrid from "./Subcomponents/RemoteVideosGrid";
import RoomInfoHub from "./Subcomponents/RoomInfoHub";
import SelfVideo from "./Subcomponents/SelfVideo";

function RoomPage() {
  return (
    <>
      <div class="h-screen text-center flex flex-col">
        <div class="flex flex-row items-center justify-center sm:justify-between px-2 gap-x-4 z-[1]">
          <SelfVideo />
          <div class="pt-4">
            <h1 class="text-4xl text-center font-bold mb-4 px-2">
              My chat room
            </h1>
            <RoomInfoHub />
          </div>
          <LeaveRoomBtn />
        </div>
        <RemoteVideosGrid />
      </div>
      <EntryPermissionDialog />
    </>
  );
}

export default RoomPage;
