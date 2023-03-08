import { SessionData } from "express-session";
import {
  HydratedDocumentFromSchema,
  Connection as MongooseConnection,
} from "mongoose";
import { createMapFromObj } from "../utils/map";
import { generateRoomMemberData } from "./schemas/member/helperFns";
import roomSchema from "./schemas/room";

type RoomDocument = HydratedDocumentFromSchema<typeof roomSchema>;
type RoomId = string extends RoomDocument["id"] ? string : never;

function makeRoomModel(mongoClient: MongooseConnection) {
  const RoomModel = mongoClient.model("room", roomSchema);

  // This is to fix a bug in mongoose that prevents type checking on constructor.
  // Having a wrapper class, provides the strict type checking.
  class Room extends RoomModel {
    static async make(adminUserData: SessionData["userData"]) {
      const adminMember = generateRoomMemberData(adminUserData, true);
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

export default makeRoomModel;
export type { RoomId, RoomDocument };
