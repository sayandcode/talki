import { createConnection } from "mongoose";
import { APIGatewayRequestAuthorizerHandler as Handler } from "aws-lambda";
import ROOM_WS_AUTHORIZER_ENV_VARS from "./env";
import generateAuthPolicy from "./utils/generateAuthPolicy";
import RoomWs$connectEventValidator from "./utils/qsValidator";
import { attemptRoomWsConnection } from "./utils/connectionHelpers";

const mongoUrl = ROOM_WS_AUTHORIZER_ENV_VARS.MONGODB_CONNECTION_URL;
const mongoClient = createConnection(mongoUrl);

// eslint-disable-next-line import/prefer-default-export
export const handler: Handler = async ({
  queryStringParameters,
  methodArn,
  requestContext,
}) => {
  if (!queryStringParameters) return generateAuthPolicy(false, methodArn);
  const { roomId, memberId, nonce } = queryStringParameters;
  const { connectionId } = requestContext;

  const eventValidateResult = RoomWs$connectEventValidator.safeParse({
    connectionId,
    roomId,
    memberId,
    nonce,
  });
  if (!eventValidateResult.success) return generateAuthPolicy(false, methodArn);

  const connectionAttemptResult = await attemptRoomWsConnection(
    eventValidateResult.data,
    mongoClient
  );
  if (!connectionAttemptResult.success)
    return generateAuthPolicy(false, methodArn);


  return generateAuthPolicy(true, methodArn);
};
