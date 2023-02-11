import { ApiError } from "middleware/errors";
import makeRoomModel, { RoomId } from "models/Room";
import DatabaseClients from "services/db";
import makeAsyncController from "utils/reqRes/asyncController";
// import APP_ENV_VARS from "utils/setup/env";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import APP_ENV_VARS from "utils/setup/env";
import { RoomIdValidator } from "./_utils/validators";
import { getUserDataFromAuthedReq } from "./_utils/reqManipulators";

const BodyValidator = z.object({
  roomId: RoomIdValidator,
});

type RequiredBody = {
  roomId: RoomId;
};

function makeRoomJoinController(databaseClients: DatabaseClients) {
  return makeAsyncController(async (req, res, next) => {
    const userData = getUserDataFromAuthedReq(req);

    const bodyParseResult = BodyValidator.safeParse(req.body);
    if (!bodyParseResult.success) {
      const errMsg = fromZodError(bodyParseResult.error).message;
      next(new ApiError(400, errMsg));
      return;
    }

    const { roomId } = bodyParseResult.data satisfies RequiredBody;

    const Room = makeRoomModel(databaseClients.mongoClient);
    const requestedRoom = await Room.findById(roomId);
    if (!requestedRoom) {
      next(new ApiError(404, "Couldn't find room"));
      return;
    }
    const newMember = await requestedRoom.addMember(userData);

    res.status(200).json({
      wsUrl: APP_ENV_VARS.ROOM_WS_URL,
      roomId,
      memberId: newMember.memberId,
      nonce: newMember.nonce,
      expireAt: requestedRoom.expireAt,
    });
  });
}

export default makeRoomJoinController;
