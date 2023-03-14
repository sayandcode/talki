import { ApiError } from "@appLambda/middleware/errors";
import makeRoomModel from "models/Room/index.model";
import DatabaseClients from "@appLambda/services/db";
import makeAsyncController from "@appLambda/utils/reqRes/asyncController";
import { z } from "zod";
import APP_ENV_VARS from "@appLambda/env";
import RoomModelValidators from "models/Room/index.validator";
import makeTypedBodyController from "@appLambda/utils/reqRes/typedParsedBody";
import { RoomMember } from "models/Room/schemas/member/index.schema";
import { getUserDataFromAuthedReq } from "./_utils/reqManipulators";

const BodyValidator = z.object({
  roomId: RoomModelValidators.roomId,
});

function makeRoomJoinController(databaseClients: DatabaseClients) {
  return makeAsyncController(
    makeTypedBodyController(BodyValidator, async (req, res, next) => {
      const userData = getUserDataFromAuthedReq(req);
      const { roomId } = req.body;

      const Room = makeRoomModel(databaseClients.mongoClient);
      const requestedRoom = await Room.findById(roomId);
      if (!requestedRoom) {
        next(new ApiError(404, "Couldn't find room"));
        return;
      }

      let memberId: RoomMember["memberId"];
      let nonce: NonNullable<RoomMember["nonce"]>;
      if (requestedRoom.getIsMemberAdded(userData))
        ({ memberId, nonce } = await requestedRoom.refreshMember(userData));
      else ({ memberId, nonce } = await requestedRoom.addMember(userData));

      res.status(200).json({
        wsUrl: APP_ENV_VARS.ROOM_WS_URL,
        roomId,
        memberId,
        nonce,
        expireAt: requestedRoom.expireAt,
      });
    })
  );
}

export default makeRoomJoinController;
