import streamContainerManager from "scripts/pages/room/pageManip/streamContainer";
import type { RoomMemberId } from "utils/types/Room";

function getConnectionTrackEventHandler(newMemberId: RoomMemberId) {
  return (e: RTCTrackEvent) => {
    const [remoteStream] = e.streams;
    if (!remoteStream) throw new Error("No stream available in track event");
    streamContainerManager.addRemoteStream(remoteStream, newMemberId);
  };
}

export default getConnectionTrackEventHandler;
