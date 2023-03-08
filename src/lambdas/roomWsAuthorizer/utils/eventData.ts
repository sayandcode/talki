import RoomModelValidators from "models/Room/index.validator";
import { z } from "zod";
import { APIGatewayRequestAuthorizerEvent } from "aws-lambda";

const EventValidator = z.object({
  connectionId: RoomModelValidators.connectionId,
  roomId: RoomModelValidators.roomId,
  memberId: RoomModelValidators.memberId,
  nonce: RoomModelValidators.nonce,
});

type ParsedEvent = z.infer<typeof EventValidator>;

type Params = Pick<
  APIGatewayRequestAuthorizerEvent,
  "queryStringParameters" | "requestContext"
>;
type ParseResult = { success: false } | { success: true; data: ParsedEvent };

function parseRoomWsAuthorizerEventData({
  queryStringParameters,
  requestContext,
}: Params): ParseResult {
  if (!queryStringParameters) return { success: false };
  const { roomId, memberId, nonce } = queryStringParameters;
  const { connectionId } = requestContext;
  return EventValidator.safeParse({
    connectionId,
    roomId,
    memberId,
    nonce,
  });
}

export default parseRoomWsAuthorizerEventData;
