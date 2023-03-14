import { SessionData } from "express-session";
import { Schema } from "mongoose";
import {
  generateRoomMemberData,
  getIsMemberAllowed,
  getIsMemberConnected,
  getMemberIdFromUserData,
} from "./member/helperFns";
import roomMemberSchema, {
  AllowedRoomMember,
  ConnectedRoomMember,
  RoomMember,
} from "./member/index.schema";

const ROOM_TIMEOUT = 5 * 60; // seconds

type MemberId = RoomMember["memberId"];
type Nonce = NonNullable<RoomMember["nonce"]>;
type ConnectionId = NonNullable<RoomMember["connectionId"]>;

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
        if (!requestedMember)
          throw new Error("Cannot verify nonce for invalid member");
        const isNonceSame = requestedMember.nonce === nonce;
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
      getMemberFromConnectionId(
        connectionId: ConnectionId
      ): ConnectedRoomMember | null {
        for (const member of this.members.values()) {
          if (
            getIsMemberConnected(member) &&
            member.connectionId === connectionId
          )
            return member;
        }
        return null;
      },

      getAllowedMembers() {
        const allowedMembers: AllowedRoomMember[] = [];
        for (const member of this.members.values()) {
          if (getIsMemberAllowed(member)) allowedMembers.push(member);
        }
        return allowedMembers;
      },

      getIsMemberAdded(userData: SessionData["userData"]) {
        const memberId = getMemberIdFromUserData(userData);
        return this.members.has(memberId);
      },

      async refreshMember(userData: SessionData["userData"]) {
        const memberId = getMemberIdFromUserData(userData);
        const existingMember = this.members.get(memberId);
        if (!existingMember)
          throw new Error("Member does not exist, so cannot be refreshed");

        const refreshedMemberData = generateRoomMemberData(
          userData,
          existingMember.isAllowedInRoom
        );
        this.members.set(memberId, refreshedMemberData);
        await this.save();
        return refreshedMemberData;
      },
    },
  }
);

export default roomSchema;
