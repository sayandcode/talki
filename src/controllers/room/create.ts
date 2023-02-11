import makeRoomModel from "models/Room/index.model";
import DatabaseClients from "services/db";
import makeAsyncController from "utils/reqRes/asyncController";
import APP_ENV_VARS from "utils/setup/env";
import { getUserDataFromAuthedReq } from "./_utils/reqManipulators";

function makeRoomCreateController(databaseClients: DatabaseClients) {
  return makeAsyncController(async (req, res) => {
    const adminUserData = getUserDataFromAuthedReq(req);

    const Room = makeRoomModel(databaseClients.mongoClient);
    const { newRoom, adminMember } = await Room.make(adminUserData);

    res.status(200).json({
      wsUrl: APP_ENV_VARS.ROOM_WS_URL,
      roomId: newRoom.id,
      memberId: adminMember.memberId,
      nonce: adminMember.nonce,
      expireAt: newRoom.expireAt,
    });
  });
}

export default makeRoomCreateController;
