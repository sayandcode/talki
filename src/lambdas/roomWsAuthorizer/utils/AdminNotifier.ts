import WsBackend from "@utils/WsBackend";
import { RoomDocument } from "models/Room/index.model";
import { getIsMemberConnected } from "models/Room/schemas/member/helperFns";
import {
  ConnectedRoomMember,
  RoomMember,
} from "models/Room/schemas/member/index.schema";
import ROOM_WS_AUTHORIZER_ENV_VARS from "../env";

const wsUrl = ROOM_WS_AUTHORIZER_ENV_VARS.ROOM_WS_URL;
const wsBackend = new WsBackend(wsUrl);

type Member = RoomMember;
type MemberId = Member["memberId"];

class AdminNotifier {
  constructor(
    private requestingMemberId: MemberId,
    private requestedRoom: RoomDocument
  ) {}

  async notifyAboutNewMember() {
    const { adminMember, msg } = this;
    await wsBackend.sendMsgToWs(adminMember.connectionId, msg);
  }

  private get adminMember(): ConnectedRoomMember {
    const adminMember = this.requestedRoom.getAdminMember();
    if (adminMember.memberId === this.requestingMemberId)
      throw new Error("Admin member doesn't need to request to join room");
    if (!getIsMemberConnected(adminMember))
      throw new Error(
        "Verify that admin is connected to websocket, before sending messages"
      );
    return adminMember;
  }

  private get msg() {
    const { memberId, userData } = this.requestingMember;
    return {
      action: "askEntryPermission",
      payload: {
        newMemberId: memberId,
        userData,
      },
    };
  }

  private get requestingMember() {
    const member = this.requestedRoom.members.get(this.requestingMemberId);
    if (!member) throw new Error("Room doesn't have requesting member");
    return member;
  }
}

export default AdminNotifier;
