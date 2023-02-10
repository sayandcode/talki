import { ApiError } from "middleware/errors";
import DatabaseClients from "services/db";
import makeAsyncController from "utils/reqRes/asyncController";
import { fromZodError } from "zod-validation-error";
import RoomWs$connectBodyValidator, {
  RequiredRoomWs$connectBody,
} from "./bodyValidator";
import {
  findMemberAndRoom,
  switchNonceForConnectionId,
} from "./dbManipulators";

const NOT_FOUND_ERR_MSG = "Requested room or member doesn't exist";

function makeRoomWs$connectRoute(databaseClients: DatabaseClients) {
  return makeAsyncController(async (req, res, next) => {
    const bodyParseResult = RoomWs$connectBodyValidator.safeParse(req.body);
    if (!bodyParseResult.success) {
      const errMsg = fromZodError(bodyParseResult.error).message;
      next(new ApiError(400, errMsg));
      return;
    }

    const { nonce, roomId, memberId, connectionId } =
      bodyParseResult.data satisfies RequiredRoomWs$connectBody;

    const roomMemberSearchResult = await findMemberAndRoom({
      roomId,
      memberId,
      databaseClients,
    });
    const isRequestValid =
      roomMemberSearchResult &&
      roomMemberSearchResult.requestedMember.nonce === nonce;
    if (!isRequestValid) {
      next(new ApiError(404, NOT_FOUND_ERR_MSG));
      return;
    }
    await switchNonceForConnectionId(roomMemberSearchResult, connectionId);

    res.status(200).send("Connection successful");
  });
}

export default makeRoomWs$connectRoute;
