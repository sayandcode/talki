import { Schema, InferSchemaType } from "mongoose";

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

type RoomMember = InferSchemaType<typeof roomMemberSchema>;
type ConnectedRoomMember = RoomMember & {
  connectionId: NonNullable<RoomMember["connectionId"]>;
};
type AllowedRoomMember = ConnectedRoomMember & {
  isAllowedInRoom: true;
};

export default roomMemberSchema;
export type { RoomMember, ConnectedRoomMember, AllowedRoomMember };
