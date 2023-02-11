import { ApiError } from "middleware/errors";
import DatabaseClients from "services/db";
import makeAsyncController from "utils/reqRes/asyncController";
import { fromZodError } from "zod-validation-error";
import makeRoomModel from "models/Room";
import RoomWs$connectBodyValidator, {
  RequiredRoomWs$connectBody,
} from "./bodyValidator";

const NOT_FOUND_ERR_MSG = "Requested room or member doesn't exist";

function makeRoomWs$connectRoute(databaseClients: DatabaseClients) {
  return makeAsyncController(async (req, res, next) => {
    const bodyParseResult = RoomWs$connectBodyValidator.safeParse(req.body);
    if (!bodyParseResult.success) {
      const errMsg = fromZodError(bodyParseResult.error).message;
      next(new ApiError(400, errMsg));
      return;
    }

    const isConnectionSuccess = await attemptConnection(
      bodyParseResult.data,
      databaseClients
    );
    if (!isConnectionSuccess) {
      next(new ApiError(404, NOT_FOUND_ERR_MSG));
      return;
    }

    res.status(200).send("Connection successful");
  });
}

async function attemptConnection(
  body: RequiredRoomWs$connectBody,
  databaseClients: DatabaseClients
): Promise<boolean> {
  const { nonce, roomId, memberId, connectionId } = body;
  const Room = makeRoomModel(databaseClients.mongoClient);
  const requestedRoom = await Room.findById(roomId);
  return (
    requestedRoom?.confirmConnection({
      memberId,
      nonce,
      connectionId,
    }) || false
  );
}

export default makeRoomWs$connectRoute;
