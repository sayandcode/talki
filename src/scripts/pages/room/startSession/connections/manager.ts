/* eslint-disable no-underscore-dangle */
import type { RoomMemberId } from "utils/types/Room";
import RoomPeerConnection from "./connection";

class ConnectionsManager {
  private _list: Record<RoomMemberId, RoomPeerConnection> = {};

  createConnection(newMemberId: RoomMemberId): RoomPeerConnection {
    const pc = new RoomPeerConnection(newMemberId);
    this._list[newMemberId] = pc;
    return pc;
  }
}

const connectionsManager = new ConnectionsManager();
export default connectionsManager;
