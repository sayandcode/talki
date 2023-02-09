import { Schema } from "mongoose";
import DatabaseClients from "services/db";

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
    nonce: { type: String, required: false },
    connectionId: { type: String, required: false },
    isAdmin: { type: Boolean, required: true },
    isAllowedInRoom: { type: Boolean, required: true },
  },
  { _id: false }
);

const roomSchema = new Schema({
  members: { type: Map, of: memberSchema, required: true },
  expireAt: {
    type: Date,
    expires: 1,
    default: () => new Date(Date.now() + ROOM_TIMEOUT * 1000),
    required: false,
  },
});

function makeRoomModel(mongoClient: DatabaseClients["mongoClient"]) {
  const RoomModel = mongoClient.model("room", roomSchema);

  // This is to fix a bug in mongoose that prevents type checking on constructor.
  // Having a wrapper class, provides the strict type checking.
  class Room extends RoomModel {}
  return Room;
}

export default makeRoomModel;
