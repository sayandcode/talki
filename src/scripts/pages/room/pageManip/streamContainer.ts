/* eslint-disable no-underscore-dangle */
import getElById from "utils/functions/getElById";
import type { RoomMemberId } from "utils/types/Room";

const STREAM_CONTAINERS_CONTAINER_ID = "stream-containers-container";
const LOCAL_STREAM_CONTAINER_ID = "local-stream-container";

class StreamContainerManager {
  private _localStreamContainer: MediaStream | undefined;

  public readonly remoteStreamContainers: Record<RoomMemberId, MediaStream> =
    {};

  private static get streamContainersContainer() {
    return getElById<HTMLDivElement>(STREAM_CONTAINERS_CONTAINER_ID);
  }

  private static createContainer() {
    const vidElContainer = document.createElement("div");
    vidElContainer.classList.add("w-full", "h-full", "relative");

    const vidEl = document.createElement("video");
    vidElContainer.appendChild(vidEl);
    vidEl.classList.add("absolute", "w-full", "h-full", "object-cover");
    vidEl.autoplay = true;

    this.streamContainersContainer.appendChild(vidElContainer);
    this.styleAllContainers();
    return vidEl;
  }

  private static styleAllContainers() {
    const { rows, columns } = this.rowsAndColumns;
    this.streamContainersContainer.style.setProperty("--grid-rows", `${rows}`);
    this.streamContainersContainer.style.setProperty(
      "--grid-cols",
      `${columns}`
    );
  }

  private static get rowsAndColumns() {
    const totalCount = this.streamContainersContainer.children.length;
    const countRoot = Math.sqrt(totalCount);
    const columns = Math.round(countRoot) + (isRoundedBelow(countRoot) ? 1 : 0);
    const rows = Math.round(countRoot);
    return { rows, columns };

    function isRoundedBelow(num: number) {
      return Math.round(num) < num;
    }
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
