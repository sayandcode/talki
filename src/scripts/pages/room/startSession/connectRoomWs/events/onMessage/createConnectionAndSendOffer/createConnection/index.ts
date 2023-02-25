import type { RoomMemberId } from "utils/types/Room";
import setupPeerConnectionEventListeners from "./setupEventListeners";
import setupConnectionTracks from "./setupTracks";

function createConnection(newMemberId: RoomMemberId) {
  const pc = new RTCPeerConnection();
  setupConnectionTracks(pc);
  setupPeerConnectionEventListeners(pc, { newMemberId });
  return pc;
}

export default createConnection;
