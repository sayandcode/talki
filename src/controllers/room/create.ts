import makeRoomModel from "models/Room";
import { createMapFromObj } from "models/utils/map";
import DatabaseClients from "services/db";
import makeAsyncController from "utils/reqRes/asyncController";
import APP_ENV_VARS from "utils/setup/env";
import { SessionData } from "express-session";
import { getUserDataFromAuthedReq } from "./_utils/reqManipulators";
import { createRoomMember } from "./_utils/dbManipulators";

function makeRoomCreateController(databaseClients: DatabaseClients) {
  return makeAsyncController(async (req, res) => {
    const userData = getUserDataFromAuthedReq(req);
    const { roomId, nonce, expireAt, memberId } = await createNewRoom(
      userData,
      databaseClients.mongoClient
    );

    res.status(200).json({
      wsUrl: APP_ENV_VARS.ROOM_WS_URL,
      roomId,
      memberId,
      nonce,
      expireAt,
    });
  });
}

async function createNewRoom(
  userData: SessionData["userData"],
  mongoClient: Parameters<typeof makeRoomModel>[0]
) {
  const Room = makeRoomModel(mongoClient);

  const newMember = createRoomMember(userData, true);
  const { nonce, memberId } = newMember;
  const newRoom = new Room({
    members: createMapFromObj({
      [memberId]: newMember,
    }),
  });
  await newRoom.save();

  return { nonce, memberId, roomId: newRoom.id, expireAt: newRoom.expireAt };
}

export default makeRoomCreateController;
