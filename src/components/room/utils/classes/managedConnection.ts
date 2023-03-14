import type useRemoteStreamsManager from "components/room/Subcomponents/RemoteVideosGrid/hooks/useRemoteStreamsManager";
import type { RoomMemberId } from "utils/types/Room";
import RoomPeerConnection from "./connection";

type ListenerEvents = keyof RTCPeerConnectionEventMap;
type ListenerFn<E extends ListenerEvents> = (
  this: RTCPeerConnection,
  ev: RTCPeerConnectionEventMap[E]
) => any;

class ManagedConnection extends RoomPeerConnection {
  private static list: Map<RoomMemberId, ManagedConnection> = new Map();

  private static addToList(conn: ManagedConnection) {
    const alreadyAddedConn = this.list.get(conn.memberId);
    if (alreadyAddedConn) alreadyAddedConn.destroy();
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

  private listeners: { [k in ListenerEvents]?: ListenerFn<k> } = {};

  constructor(
    private memberId: RoomMemberId,
    private remoteStreamsManager: ReturnType<typeof useRemoteStreamsManager>,
    localStream: MediaStream
  ) {
    super(localStream);
    this.addTrackEventListener();
    this.addConnectionStateChangeListener();
    ManagedConnection.addToList(this);
  }

  setupIceListener(iceEventHandler: (e: RTCPeerConnectionIceEvent) => void) {
    this.pc.addEventListener("icecandidate", iceEventHandler);
  }

  private addTrackEventListener() {
    const listener = (e: RTCTrackEvent) => {
      const [remoteStream] = e.streams;
      if (!remoteStream) throw new Error("No stream available in track event");
      this.remoteStreamsManager.addStream(remoteStream, this.memberId);
    };
    this.pc.addEventListener("track", listener);
    this.listeners.track = listener;
  }

  private addConnectionStateChangeListener() {
    const listener = () => {
      const isConnectionClosed = this.pc.connectionState === "failed";
      if (!isConnectionClosed) return;
      this.remoteStreamsManager.removeStream(this.memberId);
      ManagedConnection.removeFromList(this);
    };
    this.pc.addEventListener("connectionstatechange", listener);
    this.listeners.connectionstatechange = listener;
  }

  private destroy() {
    const { pc } = this;
    Object.entries(this.listeners).forEach(([eventName, listener]) => {
      pc.removeEventListener(
        eventName as ListenerEvents,
        listener as ListenerFn<ListenerEvents>
      );
    });
  }
}

export default ManagedConnection;
