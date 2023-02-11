import { SessionData } from "express-session";
import { InferSchemaType, Schema, Document } from "mongoose";
import DatabaseClients from "services/db";
import generateNonce from "utils/generateNonce";

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
    isAdmin: { type: Boolean, required: true },
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
    expireAt: {
      type: Date,
      expires: 1,
      default: () => new Date(Date.now() + ROOM_TIMEOUT * 1000),
      required: false,
    },
  },
  {
    methods: {
      async addMember(
        userData: SessionData["userData"],
        isFirstMember: boolean
      ) {
        const memberId = userData.userId;
        const memberData = {
          userData,
          memberId,
          connectionId: undefined,
          nonce: generateNonce().nonce, // to verify identity in ws connection
          isAdmin: isFirstMember,
          isAllowedInRoom: isFirstMember,
        };
        this.members.set(memberId, memberData);
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

type RoomId = string extends Document["_id"] ? string : never;

function makeRoomModel(mongoClient: DatabaseClients["mongoClient"]) {
  const RoomModel = mongoClient.model("room", roomSchema);

  // This is to fix a bug in mongoose that prevents type checking on constructor.
  // Having a wrapper class, provides the strict type checking.
  class Room extends RoomModel {
    static async make(adminUserData: SessionData["userData"]) {
      const newRoom = new this({ members: new Map() });
      const adminMember = await newRoom.addMember(adminUserData, true);
      return { newRoom, adminMember };
    }
  }
  return Room;
}

export default makeRoomModel;
export type { RoomMemberSchemaType, RoomId };
