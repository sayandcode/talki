import type { RoomMemberId } from "utils/types/Room";
import RemoteStreamsManager from "../../pageManip/RemoteStreamsManager";
import RoomPeerConnection from "./connection";

class ManagedConnection extends RoomPeerConnection {
  private static list: Map<RoomMemberId, ManagedConnection> = new Map();

  static getFromMemberId(memberId: RoomMemberId) {
    return ManagedConnection.list.get(memberId);
  }

  public resolveWaitForPeerToPromptIceCandidates?: () => void;

  // this has to come after the resolve, or else the resolve fn is reset to undefined
  public readonly waitForPeerToPromptIceCandidates = new Promise<void>(
    (res) => {
      this.resolveWaitForPeerToPromptIceCandidates = res;
    }
  );

  constructor(private memberId: RoomMemberId) {
    super();
    this.pc.addEventListener("track", this.getRemoteTrackEventHandler());
    this.addToStaticList();
  }

  setupIceListener(iceEventHandler: (e: RTCPeerConnectionIceEvent) => void) {
    this.pc.addEventListener("icecandidate", iceEventHandler);
  }

  private addToStaticList() {
    const isAddedAlready = ManagedConnection.list.has(this.memberId);
    if (isAddedAlready)
      throw new Error("The connection for this member already exists");
    ManagedConnection.list.set(this.memberId, this);
  }

  private getRemoteTrackEventHandler() {
    return (e: RTCTrackEvent) => {
      const [remoteStream] = e.streams;
      if (!remoteStream) throw new Error("No stream available in track event");
      RemoteStreamsManager.addRemoteStream(remoteStream, this.memberId);
    };
  }
}

export default ManagedConnection;
