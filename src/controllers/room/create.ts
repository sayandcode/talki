import makeRoomModel from "models/Room";
import { createMapFromObj } from "models/utils/map";
import DatabaseClients from "services/db";
import makeAsyncController from "utils/reqRes/asyncController";

function makeRoomCreateController(databaseClients: DatabaseClients) {
  return makeAsyncController(async (req, res) => {
    const { userData } = req.session;
    if (!userData)
      throw new Error(
        "This route should be allowed only for authenticated users"
      );

    const Room = makeRoomModel(databaseClients);
    const newRoom = new Room({
      members: createMapFromObj({
        [userData.userId]: {
          userData,
          isAdmin: true, // since a new room is being created, put this user as admin
        },
      }),
    });
    await newRoom.save();

    const roomId = newRoom.id;
    res.status(200).json({ roomId });
  });
}

export default makeRoomCreateController;
