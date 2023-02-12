import { ApiError } from "middleware/errors";
import DatabaseClients from "services/db";
import makeAsyncController from "utils/reqRes/asyncController";
import { fromZodError } from "zod-validation-error";
import RoomWs$connectBodyValidator from "./bodyValidator";
import {
  askAdminForEntryPermission,
  attemptConnection,
} from "./connectionHelpers";

const NOT_FOUND_ERR_MSG = "Requested room or member doesn't exist";

function makeRoomWs$connectRoute(databaseClients: DatabaseClients) {
  return makeAsyncController(async (req, res, next) => {
    const bodyParseResult = RoomWs$connectBodyValidator.safeParse(req.body);
    if (!bodyParseResult.success) {
      const errMsg = fromZodError(bodyParseResult.error).message;
      next(new ApiError(400, errMsg));
      return;
    }

    const connectionAttemptResult = await attemptConnection(
      bodyParseResult.data,
      databaseClients
    );
    if (!connectionAttemptResult.success) {
      next(new ApiError(404, NOT_FOUND_ERR_MSG));
      return;
    }

    const { requestedRoom } = connectionAttemptResult;
    const { memberId: requestingMemberId } = bodyParseResult.data;
    if (requestedRoom.adminMemberId !== requestingMemberId)
      await askAdminForEntryPermission({
        requestingMemberId,
        requestedRoom,
      });

    res.status(200).send("Connection successful");
  });
}

export default makeRoomWs$connectRoute;
