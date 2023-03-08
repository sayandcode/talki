import { Response, NextFunction } from "express";
import { z } from "zod";
import makeAsyncController from "@appLambda/utils/reqRes/asyncController";
import makeTypedBodyController from "@appLambda/utils/reqRes/typedParsedBody";
import RoomModelValidators from "models/Room/index.validator";
import { ApiError } from "@appLambda/middleware/errors";
import { fromZodError } from "zod-validation-error";
import makeRoomModel, { RoomDocument } from "models/Room/index.model";
import DatabaseClients from "@appLambda/services/db";
import { ConnectedRoomMember } from "models/Room/schemas/member/index.schema";

const BasicRoomWsValidator = z.object({
  connectionId: RoomModelValidators.connectionId,
  roomId: RoomModelValidators.roomId,
});

type RoomWsParsedData = {
  requestedRoom: RoomDocument;
  requestingMember: ConnectedRoomMember;
};

function makeRoomWsController<ValidatorSchema extends z.ZodSchema>(
  databaseClients: DatabaseClients,
  Validator: ValidatorSchema,
  roomWsController: (
    reqData: RoomWsParsedData & { reqBody: z.infer<ValidatorSchema> },
    res: Response,
    next: NextFunction
  ) => any
) {
  return makeAsyncController(
    makeTypedBodyController(Validator, async (req, res, next) => {
      await Promise.resolve();
      const parsedBasicBodyData = BasicRoomWsValidator.safeParse(req.body);
      if (!parsedBasicBodyData.success) {
        const errMsg = fromZodError(parsedBasicBodyData.error).message;
        next(new ApiError(400, errMsg));
        return;
      }
      const { roomId, connectionId } = parsedBasicBodyData.data;

      const Room = makeRoomModel(databaseClients.mongoClient);
      const requestedRoom = await Room.findById(roomId);
      if (!requestedRoom) {
        next(new ApiError(404, "Requested room doesn't exist"));
        return;
      }

      const requestingMember =
        requestedRoom.getMemberFromConnectionId(connectionId);
      if (!requestingMember) {
        const msg =
          "Only a member of this room is allowed to send this request";
        next(new ApiError(401, msg));
        return;
      }

      // eslint-disable-next-line consistent-return
      return roomWsController(
        { requestedRoom, requestingMember, reqBody: req.body },
        res,
        next
      );
    })
  );
}

export default makeRoomWsController;
