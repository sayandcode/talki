import { SessionData } from "express-session";
import { Schema } from "mongoose";
import roomMemberSchema, {
  getRoomMemberData,
  RoomMemberSchemaType,
} from "./member";

const ROOM_TIMEOUT = 5 * 60; // seconds

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
        const memberData = getRoomMemberData(userData, false);
        this.members.set(memberData.memberId, memberData);
        await this.save();
        return memberData;
      },

      /**
       * @returns success Whether or not the connection was successful
       */
      async confirmConnection({
        memberId,
        nonce,
        connectionId,
      }: {
        memberId: RoomMemberSchemaType["memberId"];
        nonce: NonNullable<RoomMemberSchemaType["nonce"]>;
        connectionId: NonNullable<RoomMemberSchemaType["connectionId"]>;
      }) {
        const requestedMember = this.members.get(memberId);
        const isReqValid = requestedMember && requestedMember.nonce === nonce;
        if (!isReqValid) return false;

        requestedMember.nonce = undefined;
        requestedMember.connectionId = connectionId;
        await this.save();
        return true;
      },
    },
  }
);

export default roomSchema;
