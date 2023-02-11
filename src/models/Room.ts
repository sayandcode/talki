import { SessionData } from "express-session";
import { InferSchemaType, Schema, HydratedDocumentFromSchema } from "mongoose";
import DatabaseClients from "services/db";
import generateNonce from "utils/generateNonce";
import { createMapFromObj } from "./utils/map";

const ROOM_TIMEOUT = 5 * 60; // seconds

const userDataSchema = new Schema(
  {
    userId: { type: String, required: true },
    username: { type: String, required: true },
    verified: { type: Boolean, required: true },
  },
  { _id: false }
);

const memberSchema = new Schema(
  {
    userData: { type: userDataSchema, required: true },
    memberId: { type: String, required: true },
    nonce: { type: String, required: false },
    connectionId: { type: String, required: false },
    isAllowedInRoom: { type: Boolean, required: true },
  },
  { _id: false }
);

type RoomMemberSchemaType = InferSchemaType<typeof memberSchema>;
type MemberId = RoomMemberSchemaType["memberId"];
type Nonce = NonNullable<RoomMemberSchemaType["nonce"]>;
type ConnectionId = NonNullable<RoomMemberSchemaType["connectionId"]>;

const roomSchema = new Schema(
  {
    members: { type: Map, of: memberSchema, required: true },
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
        const memberData = getMemberData(userData, false);
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
        memberId: MemberId;
        nonce: Nonce;
        connectionId: ConnectionId;
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

type RoomDocument = HydratedDocumentFromSchema<typeof roomSchema>;
type RoomId = string extends RoomDocument["id"] ? string : never;

function makeRoomModel(mongoClient: DatabaseClients["mongoClient"]) {
  const RoomModel = mongoClient.model("room", roomSchema);

  // This is to fix a bug in mongoose that prevents type checking on constructor.
  // Having a wrapper class, provides the strict type checking.
  class Room extends RoomModel {
    static async make(adminUserData: SessionData["userData"]) {
      const adminMember = getMemberData(adminUserData, true);
      const newRoom = new this({
        members: createMapFromObj({
          [adminMember.memberId]: adminMember,
        }),
        adminMemberId: adminMember.memberId,
      });
      await newRoom.save();
      return { newRoom, adminMember };
    }
  }
  return Room;
}

function getMemberData(
  userData: SessionData["userData"],
  isFirstMember: boolean
) {
  return {
    userData,
    memberId: userData.userId,
    connectionId: undefined,
    nonce: generateNonce().nonce, // to verify identity in ws connection
    isAllowedInRoom: isFirstMember,
  };
}

export default makeRoomModel;
export type { RoomMemberSchemaType, RoomId, RoomDocument };
