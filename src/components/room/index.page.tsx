import { redirectIfNotLoggedIn } from "utils/functions/redirects";
import { useEffect, useState } from "preact/hooks";
import type { RoomExpireAt, RoomId } from "utils/types/Room";
import LeaveRoomBtn from "./Subcomponents/LeaveRoomBtn";
import RemoteVideosGrid from "./Subcomponents/RemoteVideosGrid";
import RoomInfoHub from "./Subcomponents/RoomInfoHub";
import SelfVideo, { useLocalStreamManager } from "./Subcomponents/SelfVideo";
import {
  getRoomIdFromUrl,
  getRoomPageUnauthedRedirectPath as getRedirectPath,
} from "./utils/url";
import EntryPermissionModal from "./Subcomponents/EntryPermissionModal";
import useEntryPermissionModal from "./Subcomponents/EntryPermissionModal/utils/useEntryPermissionModal";
import useRemoteStreamsManager from "./Subcomponents/RemoteVideosGrid/hooks/useRemoteStreamsManager";
import setupRoomWs from "./utils/room-ws";
import { joinExistingCall, startNewCall } from "./utils/call";

type RoomData = { roomId: RoomId; expireAt: RoomExpireAt };

function RoomPage() {
  const [roomData, setRoomData] = useState<RoomData>();

  const {
    data: entryPermissionModalData,
    closeModal: closeEntryPermissionModal,
    openModal: openEntryPermissionModal,
  } = useEntryPermissionModal();

  const localStreamManager = useLocalStreamManager();
  const remoteStreamsManager = useRemoteStreamsManager();

  useEffect(() => {
    const localStream = localStreamManager.stream;
    if (!localStream) return;

    void (async () => {
      const isRedirected = await redirectIfNotLoggedIn(getRedirectPath());
      if (!isRedirected) void startSession(localStream);
    })();
  }, [localStreamManager.stream]);

  async function startSession(localStream: MediaStream) {
    const roomId = getRoomIdFromUrl();
    let newRoomData;
    if (roomId) {
      const joinAttempt = await joinExistingCall(roomId);
      if (!joinAttempt.success) return;

      newRoomData = joinAttempt.data;
    } else newRoomData = await startNewCall();

    setRoomData(newRoomData);
    setupRoomWs({
      newRoomData,
      localStream,
      remoteStreamsManager,
      openEntryPermissionModal,
    });
  }

  return (
    <>
      <div class="h-screen text-center flex flex-col">
        <div class="flex flex-row items-center justify-center sm:justify-between px-2 gap-x-4 z-[1]">
          <SelfVideo stream={localStreamManager.stream} />
          <div class="pt-4">
            <h1 class="text-4xl text-center font-bold mb-4 px-2">
              My chat room
            </h1>
            <RoomInfoHub
              roomId={roomData?.roomId}
              expireAt={roomData?.expireAt}
            />
          </div>
          <LeaveRoomBtn />
        </div>
        <RemoteVideosGrid streamsArr={remoteStreamsManager.streamsArr} />
      </div>
      <EntryPermissionModal
        data={entryPermissionModalData}
        onClose={closeEntryPermissionModal}
      />
    </>
  );
}

export default RoomPage;
