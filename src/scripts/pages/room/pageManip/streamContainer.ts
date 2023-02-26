/* eslint-disable no-underscore-dangle */
import getElById from "utils/functions/getElById";
import type { RoomMemberId } from "utils/types/Room";

const STREAM_CONTAINERS_CONTAINER_ID = "stream-containers-container";
const LOCAL_STREAM_CONTAINER_ID = "local-stream-container";

class StreamContainerManager {
  private _localStreamContainer: MediaStream | undefined;

  public readonly remoteStreamContainers: Record<RoomMemberId, MediaStream> =
    {};

  private static createContainer() {
    const streamContainersContainer = getElById(STREAM_CONTAINERS_CONTAINER_ID);
    const el = document.createElement("video");
    el.classList.add("w-24", "h-24", "bg-black");
    el.autoplay = true;
    streamContainersContainer.appendChild(el);
    return el;
  }

  set localStream(stream: MediaStream | undefined) {
    this._localStreamContainer = stream;
    if (!stream) return;
    const localStreamContainer = getElById<HTMLVideoElement>(
      LOCAL_STREAM_CONTAINER_ID
    );
    localStreamContainer.srcObject = stream;
  }

  get localStream() {
    return this._localStreamContainer;
  }

  addRemoteStream(stream: MediaStream, memberId: RoomMemberId) {
    const streamContainer = StreamContainerManager.createContainer();
    streamContainer.srcObject = stream;
    this.remoteStreamContainers[memberId] = stream;
  }
}

const streamContainerManager = new StreamContainerManager();
export default streamContainerManager;
export { STREAM_CONTAINERS_CONTAINER_ID, LOCAL_STREAM_CONTAINER_ID };
