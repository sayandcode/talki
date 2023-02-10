import makeRoomModel from "models/Room";
import { createMapFromObj } from "models/utils/map";
import DatabaseClients from "services/db";
import generateNonce from "utils/generateNonce";
import makeAsyncController from "utils/reqRes/asyncController";
import APP_ENV_VARS from "utils/setup/env";
import { SessionData } from "express-session";

function makeRoomCreateController(databaseClients: DatabaseClients) {
  return makeAsyncController(async (req, res) => {
    const { userData } = req.session;
    if (!userData)
      throw new Error(
        "This route should be allowed only for authenticated users"
      );

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

  const { memberId, nonce, memberData } = getMemberData(userData);
  const newRoom = new Room({
    members: createMapFromObj({
      [memberId]: memberData,
    }),
  });
  await newRoom.save();

  return { nonce, memberId, roomId: newRoom.id, expireAt: newRoom.expireAt };
}

function getMemberData(userData: SessionData["userData"]) {
  const { nonce } = generateNonce();
  const memberId = userData.userId;
  const memberData = {
    userData,
    memberId,
    connectionId: undefined,
    nonce, // to verify identity in ws connection
    isAdmin: true, // since a new room is being created, put this user as admin
    isAllowedInRoom: true, // cause first member
  };
  return { nonce, memberId, memberData };
}

export default makeRoomCreateController;
