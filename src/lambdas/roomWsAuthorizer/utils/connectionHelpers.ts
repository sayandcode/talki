import makeRoomModel, { RoomDocument } from "models/Room/index.model";
import { z } from "zod";
import RoomWs$connectEventValidator from "./qsValidator";

type ConnectionAttempResult = Promise<
  { success: false } | { success: true; requestedRoom: RoomDocument }
>;

async function attemptRoomWsConnection(
  requestData: z.infer<typeof RoomWs$connectEventValidator>,
  mongoClient: Parameters<typeof makeRoomModel>[0]
): ConnectionAttempResult {
  const { nonce, roomId, memberId, connectionId } = requestData;
  const Room = makeRoomModel(mongoClient);
  const requestedRoom = await Room.findById(roomId);
  if (!requestedRoom) return { success: false };
  const success = await requestedRoom.confirmConnection({
    memberId,
    nonce,
    connectionId,
  });

  if (!success) {
    return { success: false };
  }
  return { success: true, requestedRoom };
}

// eslint-disable-next-line import/prefer-default-export
export { attemptRoomWsConnection };
