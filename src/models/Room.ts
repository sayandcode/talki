import { Schema } from "mongoose";
import mongoClient from "services/db/mongo";

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
    isAdmin: { type: Boolean, required: true },
  },
  { _id: false }
);

const roomSchema = new Schema({
  members: { type: Map, of: memberSchema, required: true },
});

const RoomModel = mongoClient.model("Room", roomSchema);

// This is to fix a bug in mongoose that prevents type checking on constructor.
// Having a wrapper class, provides the strict type checking.
class Room extends RoomModel {}

export default Room;
