import { SessionData } from "express-session";
import { Schema } from "mongoose";
import roomMemberSchema, {
  generateRoomMemberData,
  RoomMemberSchemaType,
} from "./member";

const ROOM_TIMEOUT = 5 * 60; // seconds

type MemberId = RoomMemberSchemaType["memberId"];
type Nonce = NonNullable<RoomMemberSchemaType["nonce"]>;
type ConnectionId = NonNullable<RoomMemberSchemaType["connectionId"]>;

const roomSchema = new Schema(
  {
    members: { type: Map, of: roomMemberSchema, required: true },
    adminMemberId: { type: String, required: true },
    expireAt: {
      type: Date,
      expires: 1,
      default: () => new Date(Date.now() + ROOM_TIMEOUT * 1000),
      required: false,
    },
  },
  {
    methods: {
      async addMember(userData: SessionData["userData"]) {
        const memberData = generateRoomMemberData(userData, false);
        this.members.set(memberData.memberId, memberData);
        await this.save();
        return memberData;
      },

      /**
       * @returns boolean Whether or not the nonces are same
       */
      verifyNonce(memberId: MemberId, nonce: Nonce) {
        const requestedMember = this.members.get(memberId);
        const isNonceSame = requestedMember && requestedMember.nonce === nonce;
        return isNonceSame;
      },

      async confirmConnection(memberId: MemberId, connectionId: ConnectionId) {
        const requestedMember = this.members.get(memberId);
        if (!requestedMember)
          throw new Error("Requested Member doesn't exist in room");
        requestedMember.nonce = undefined;
        requestedMember.connectionId = connectionId;
        await this.save();
      },

      getAdminMember() {
        const { adminMemberId } = this;
        const member = this.members.get(adminMemberId);
        if (!member) throw new Error("Room doesn't have admin member");
        return member;
      },

      /**
       * With the help of this function, we authenticate a user based on the connectionId.
       * This is legit, cause the connectionId is only known by the API gateway and the backend app.
       */
      getMemberFromConnectionId(connectionId: ConnectionId) {
        for (const member of this.members.values()) {
          if (member.connectionId === connectionId) return member;
        }
        return null;
      },
    },
  }
);

export default roomSchema;
