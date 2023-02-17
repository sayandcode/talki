import { createConnection } from "mongoose";
import { APIGatewayRequestAuthorizerHandler as Handler } from "aws-lambda";
import makeRoomModel from "models/Room/index.model";
import ROOM_WS_AUTHORIZER_ENV_VARS from "./env";
import generateAuthPolicy from "./utils/generateAuthPolicy";
import RoomWs$connectEventValidator from "./utils/qsValidator";
import askAdminForEntryPermission from "./utils/connectionHelpers/askAdminForEntryPermission";

const mongoUrl = ROOM_WS_AUTHORIZER_ENV_VARS.MONGODB_CONNECTION_URL;
const mongoClient = createConnection(mongoUrl);

// eslint-disable-next-line import/prefer-default-export
export const handler: Handler = async ({
  queryStringParameters,
  methodArn,
  requestContext,
}) => {
  const eventValidateResult = RoomWs$connectEventValidator.safeParse({
    connectionId: requestContext.connectionId,
    roomId: queryStringParameters?.["roomId"],
    memberId: queryStringParameters?.["memberId"],
    nonce: queryStringParameters?.["nonce"],
  });
  if (!eventValidateResult.success) return generateAuthPolicy(false, methodArn);

  const { connectionId, roomId, memberId, nonce } = eventValidateResult.data;
  const Room = makeRoomModel(mongoClient);
  const requestedRoom = await Room.findById(roomId);
  if (!requestedRoom) return generateAuthPolicy(false, methodArn);

  // non admins need permission from admin to join
  if (requestedRoom.adminMemberId !== memberId) {
    const isAskAttemptSuccessful = await askAdminForEntryPermission({
      requestingMemberId: memberId,
      requestedRoom,
    });
    return generateAuthPolicy(isAskAttemptSuccessful, methodArn);
  }

  const isConnectionConfirmed = await requestedRoom.confirmConnection({
    memberId,
    nonce,
    connectionId,
  });

  return generateAuthPolicy(isConnectionConfirmed, methodArn);
};
