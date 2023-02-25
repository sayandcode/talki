import connectionsManager from "scripts/pages/room/startSession/connections/manager";
import RoomValidators, { RoomId } from "utils/types/Room";
import { z } from "zod";
import createNewPcAndAnswerItAndSendToRoomWs from "./createNewPcAndAnswerItAndSendToRoomWs";

const SdpObjectValidator = z.object({
  type: z.union([z.literal("offer"), z.literal("answer")]),
  sdp: z.string(),
}) satisfies z.ZodSchema<RTCSessionDescriptionInit>;

const PayloadValidator = z.object({
  senderMemberId: RoomValidators.RoomMemberId,
  sdp: SdpObjectValidator,
  senderData: RoomValidators.RoomUserData,
});

type Params = { payload: unknown; roomWs: WebSocket; roomId: RoomId };
async function handleReceivedSdp({ payload, roomWs, roomId }: Params) {
  const { senderMemberId, sdp } = PayloadValidator.parse(payload);
  console.log(
    "TODO: Destructure the senderData and add it to the list of members on the page"
  );

  const conn = connectionsManager.getConnectionFromMemberId(senderMemberId);
  if (conn) {
    await conn.setRemoteDescription(sdp);
    return;
  }
  await createNewPcAndAnswerItAndSendToRoomWs({
    senderMemberId,
    roomWs,
    roomId,
    offerSdp: sdp,
  });
}

export default handleReceivedSdp;
