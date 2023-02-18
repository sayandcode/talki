import { createConnection } from "mongoose";
import { APIGatewayRequestAuthorizerHandler as Handler } from "aws-lambda";
import makeRoomModel from "models/Room/index.model";
import { getIsMemberConnected } from "models/Room/schemas/member/helperFns";
import ROOM_WS_AUTHORIZER_ENV_VARS from "./env";
import generateAuthPolicy from "./utils/generateAuthPolicy";
import parseEventData from "./utils/eventData";
import AdminNotifier from "./utils/AdminNotifier";

const mongoUrl = ROOM_WS_AUTHORIZER_ENV_VARS.MONGODB_CONNECTION_URL;
const mongoClient = createConnection(mongoUrl);

// eslint-disable-next-line import/prefer-default-export
export const handler: Handler = async ({
  queryStringParameters,
  methodArn,
  requestContext,
}) => {
  const rejectedAuthPolicy = generateAuthPolicy(false, methodArn);

  // parse data from request events
  const eventDataParseResult = parseEventData({
    queryStringParameters,
    requestContext,
  });
  if (!eventDataParseResult.success) return rejectedAuthPolicy;
  const {
    connectionId,
    roomId,
    memberId: requestingMemberId,
    nonce,
  } = eventDataParseResult.data;

  const Room = makeRoomModel(mongoClient);
  const requestedRoom = await Room.findById(roomId);
  if (!requestedRoom) return rejectedAuthPolicy;

  // make sure that the room is ready to accept members
  const adminMember = requestedRoom.getAdminMember();
  const isThisRequestNotFromAdmin = adminMember.memberId !== requestingMemberId;
  const isAdminNotConnected = !getIsMemberConnected(adminMember);
  if (isThisRequestNotFromAdmin && isAdminNotConnected)
    return rejectedAuthPolicy;

  // process the sender of this request
  const isReqVerified = requestedRoom.verifyNonce(requestingMemberId, nonce);
  if (!isReqVerified) return rejectedAuthPolicy;
  await requestedRoom.confirmConnection(requestingMemberId, connectionId);
  if (isThisRequestNotFromAdmin)
    await new AdminNotifier(
      requestingMemberId,
      requestedRoom
    ).notifyAboutNewMember();

  return generateAuthPolicy(true, methodArn);
};
