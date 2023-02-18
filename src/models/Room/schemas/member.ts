import { SessionData } from "express-session";
import { Schema, InferSchemaType } from "mongoose";
import generateNonce from "@utils/generateNonce";

const userDataSchema = new Schema(
  {
    userId: { type: String, required: true },
    username: { type: String, required: true },
    verified: { type: Boolean, required: true },
  },
  { _id: false }
);

const roomMemberSchema = new Schema(
  {
    userData: { type: userDataSchema, required: true },
    memberId: { type: String, required: true },
    nonce: { type: String, required: false },
    connectionId: { type: String, required: false },
    isAllowedInRoom: { type: Boolean, required: true },
  },
  { _id: false }
);

function generateRoomMemberData(
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

type RoomMember = InferSchemaType<typeof roomMemberSchema>;
type ConnectedRoomMember = RoomMember & {
  connectionId: NonNullable<RoomMember["connectionId"]>;
};

export default roomMemberSchema;
export { generateRoomMemberData };
export type { RoomMember, ConnectedRoomMember };
