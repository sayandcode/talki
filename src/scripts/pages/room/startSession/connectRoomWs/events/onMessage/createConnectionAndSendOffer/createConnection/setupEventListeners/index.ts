import type { RoomMemberId } from "utils/types/Room";
import getIceEventHandler from "./iceEvent";
import getTrackEventHandler from "./trackEvent";

type ConnectionData = { newMemberId: RoomMemberId };

function setupPeerConnectionEventListeners(
  pc: RTCPeerConnection,
  { newMemberId }: ConnectionData
) {
  pc.addEventListener("track", getTrackEventHandler(newMemberId));
  pc.addEventListener("icecandidate", getIceEventHandler());
}

export default setupPeerConnectionEventListeners;
