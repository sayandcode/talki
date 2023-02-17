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

      getIsAdminConnected() {
        const adminMember = this.members.get(this.adminMemberId);
        if (!adminMember) throw new Error("Room doesn't have an admin member");
        return !!adminMember.connectionId;
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
    },
  }
);

export default roomSchema;
