import { SessionData } from "express-session";
import { HydratedDocumentFromSchema } from "mongoose";
import DatabaseClients from "services/db";
import { createMapFromObj } from "../utils/map";
import { getRoomMemberData } from "./schemas/member";
import roomSchema from "./schemas/room";

type RoomDocument = HydratedDocumentFromSchema<typeof roomSchema>;
type RoomId = string extends RoomDocument["id"] ? string : never;

function makeRoomModel(mongoClient: DatabaseClients["mongoClient"]) {
  const RoomModel = mongoClient.model("room", roomSchema);

  // This is to fix a bug in mongoose that prevents type checking on constructor.
  // Having a wrapper class, provides the strict type checking.
  class Room extends RoomModel {
    static async make(adminUserData: SessionData["userData"]) {
      const adminMember = getRoomMemberData(adminUserData, true);
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
