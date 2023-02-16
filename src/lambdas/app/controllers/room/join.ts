import { ApiError } from "@appLambda/middleware/errors";
import makeRoomModel from "models/Room/index.model";
import DatabaseClients from "@appLambda/services/db";
import makeAsyncController from "@appLambda/utils/reqRes/asyncController";
import { z } from "zod";
import APP_ENV_VARS from "@appLambda/env";
import { fromZodError } from "zod-validation-error";
import RoomModelValidators from "models/Room/index.validator";
import { getUserDataFromAuthedReq } from "./_utils/reqManipulators";

const BodyValidator = z.object({
  roomId: RoomModelValidators.roomId,
});

function makeRoomJoinController(databaseClients: DatabaseClients) {
  return makeAsyncController(async (req, res, next) => {
    const userData = getUserDataFromAuthedReq(req);

    const bodyParseResult = BodyValidator.safeParse(req.body);
    if (!bodyParseResult.success) {
      const errMsg = fromZodError(bodyParseResult.error).message;
      next(new ApiError(400, errMsg));
      return;
    }

    const { roomId } = bodyParseResult.data;

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
