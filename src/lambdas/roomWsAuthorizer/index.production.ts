import { createConnection } from "mongoose";
import { APIGatewayRequestAuthorizerHandler as Handler } from "aws-lambda";
import makeRoomModel from "models/Room/index.model";
import reuseDbConnections from "@utils/reuseDbConnections";
import ROOM_WS_AUTHORIZER_ENV_VARS from "./env";
import generateAuthPolicy from "./utils/generateAuthPolicy";
import parseEventData from "./utils/eventData";
import processRequestSender from "./utils/processRequestSender";
import getIsRoomReadyToAcceptMembers from "./utils/isRoomReadyToAcceptMembers";

const mongoUrl = ROOM_WS_AUTHORIZER_ENV_VARS.MONGODB_CONNECTION_URL;
const mongoClient = createConnection(mongoUrl);

// eslint-disable-next-line import/prefer-default-export
export const handler: Handler = async (
  { queryStringParameters, methodArn, requestContext },
  context
) => {
  await reuseDbConnections(context, mongoClient);
  const rejectedAuthPolicy = generateAuthPolicy(false, methodArn);

  // parse data from request events
  const eventDataParseResult = parseEventData({
    queryStringParameters,
    requestContext,
  });
  if (!eventDataParseResult.success) return rejectedAuthPolicy;
  const { roomId, memberId: requestingMemberId } = eventDataParseResult.data;

  const Room = makeRoomModel(mongoClient);
  const requestedRoom = await Room.findById(roomId);
  if (!requestedRoom) return rejectedAuthPolicy;

  const isRoomReadyToAcceptMembers = getIsRoomReadyToAcceptMembers(
    requestedRoom,
    requestingMemberId
  );
  if (isRoomReadyToAcceptMembers) return rejectedAuthPolicy;

  const isProcessingSuccessful = await processRequestSender(
    requestedRoom,
    eventDataParseResult.data
  );
  return generateAuthPolicy(isProcessingSuccessful, methodArn);
};
