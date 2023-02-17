import WsBackend from "@utils/WsBackend";
import { RoomDocument } from "models/Room/index.model";
import { RoomMemberSchemaType } from "models/Room/schemas/member";
import ROOM_WS_AUTHORIZER_ENV_VARS from "../env";

const wsUrl = ROOM_WS_AUTHORIZER_ENV_VARS.ROOM_WS_URL;
const wsBackend = new WsBackend(wsUrl);

type Member = RoomMemberSchemaType;
type MemberId = Member["memberId"];

type ConnectedMember = Member & {
  connectionId: NonNullable<Member["connectionId"]>;
};

class AdminNotifier {
  constructor(
    private requestingMemberId: MemberId,
    private requestedRoom: RoomDocument
  ) {}

  async notifyAboutNewMember() {
    const { adminMember, msg } = this;
    await wsBackend.sendMsgToWs(adminMember.connectionId, msg);
  }

  private get adminMember(): ConnectedMember {
    const adminMember = this.requestedRoom.getAdminMember();
    if (adminMember.memberId === this.requestingMemberId)
      throw new Error("Admin member doesn't need to request to join room");
    if (!getIsMemberConnected(adminMember))
      throw new Error(
        "Verify that admin is connected to websocket, before sending messages"
      );
    return adminMember;

    function getIsMemberConnected(
      givenMember: Member
    ): givenMember is ConnectedMember {
      return !!givenMember.connectionId;
    }
  }

  private get msg() {
    const { memberId, userData } = this.requestingMember;
    return {
      action: "allowMemberInRoom",
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
