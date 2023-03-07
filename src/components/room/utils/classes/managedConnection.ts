import type useRemoteStreamsManager from "components/room/Subcomponents/RemoteVideosGrid/hooks/useRemoteStreamsManager";
import type { RoomMemberId } from "utils/types/Room";
import RoomPeerConnection from "./connection";

class ManagedConnection extends RoomPeerConnection {
  private static list: Map<RoomMemberId, ManagedConnection> = new Map();

  private static addToList(conn: ManagedConnection) {
    const isAddedAlready = this.list.has(conn.memberId);
    if (isAddedAlready)
      throw new Error("The connection for this member already exists");
    this.list.set(conn.memberId, conn);
  }

  private static removeFromList(conn: ManagedConnection) {
    const isAddedAlready = this.list.has(conn.memberId);
    if (!isAddedAlready) throw new Error("This connection is not in the list");
    this.list.delete(conn.memberId);
  }

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

  constructor(
    private memberId: RoomMemberId,
    private remoteStreamsManager: ReturnType<typeof useRemoteStreamsManager>,
    localStream: MediaStream
  ) {
    super(localStream);
    this.pc.addEventListener("track", this.getRemoteTrackEventHandler());
    this.pc.addEventListener(
      "connectionstatechange",
      this.getConnectionStateChangeHandler()
    );
    ManagedConnection.addToList(this);
  }

  setupIceListener(iceEventHandler: (e: RTCPeerConnectionIceEvent) => void) {
    this.pc.addEventListener("icecandidate", iceEventHandler);
  }

  private getRemoteTrackEventHandler() {
    return (e: RTCTrackEvent) => {
      const [remoteStream] = e.streams;
      if (!remoteStream) throw new Error("No stream available in track event");
      this.remoteStreamsManager.addStream(remoteStream, this.memberId);
    };
  }

  private getConnectionStateChangeHandler() {
    return () => {
      const isConnectionClosed = this.pc.connectionState === "failed";
      if (!isConnectionClosed) return;
      this.remoteStreamsManager.removeStream(this.memberId);
      ManagedConnection.removeFromList(this);
    };
  }
}

export default ManagedConnection;
