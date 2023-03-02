import getElById from "utils/functions/getElById";
import type { RoomMemberId } from "utils/types/Room";

class RemoteStreamsManager {
  static readonly CONTAINERS_GRID_EL_ID = "remote-streams-grid";

  private static readonly remoteStreams: Map<
    RoomMemberId,
    { stream: MediaStream; container: HTMLDivElement }
  > = new Map();

  private static get containersGridEl() {
    return getElById<HTMLDivElement>(this.CONTAINERS_GRID_EL_ID);
  }

  static addRemoteStream(stream: MediaStream, memberId: RoomMemberId) {
    const container = RemoteStreamsManager.createContainer(stream);
    this.remoteStreams.set(memberId, { stream, container });
  }

  private static createContainer(stream: MediaStream) {
    const vidElContainer = document.createElement("div");
    vidElContainer.classList.add("w-full", "h-full", "relative");

    const vidEl = document.createElement("video");
    vidElContainer.appendChild(vidEl);
    vidEl.classList.add("absolute", "w-full", "h-full", "object-cover");
    vidEl.autoplay = true;
    vidEl.srcObject = stream;

    this.containersGridEl.appendChild(vidElContainer);
    this.styleGrid();

    return vidElContainer;
  }

  private static styleGrid() {
    const { rows, columns } = this.rowsAndColumns;
    this.containersGridEl.style.setProperty("--grid-rows", `${rows}`);
    this.containersGridEl.style.setProperty("--grid-cols", `${columns}`);
  }

  private static get rowsAndColumns() {
    const totalCount = this.containersGridEl.children.length;
    const countRoot = Math.sqrt(totalCount);
    const columns = Math.round(countRoot) + (isRoundedBelow(countRoot) ? 1 : 0);
    const rows = Math.round(countRoot);
    return { rows, columns };

    function isRoundedBelow(num: number) {
      return Math.round(num) < num;
    }
  }
}

export default RemoteStreamsManager;
