import RoomValidators from "utils/types/Room";
import { z } from "zod";
import MessageActionHandler from "..";
import promptPeerToSendIceCandidates from "./promptPeerToSendIce";
import ManagedConnection from "../../managedConnection";
import createNewPcAndAnswerItAndSendToRoomWs from "./createConnAndAnswerItAndSendToRoomWs";

const SdpObjectValidator = z.object({
  type: z.union([z.literal("offer"), z.literal("answer")]),
  sdp: z.string(),
}) satisfies z.ZodSchema<RTCSessionDescriptionInit>;

const PayloadValidator = z.object({
  senderMemberId: RoomValidators.RoomMemberId,
  sdp: SdpObjectValidator,
  senderData: RoomValidators.RoomUserData,
});

type FnParams = Pick<
  Parameters<typeof createNewPcAndAnswerItAndSendToRoomWs>[0],
  "remoteStreamsManager" | "localStream"
>;

function makeSendSdpActionHandler({
  remoteStreamsManager,
  localStream,
}: FnParams) {
  return MessageActionHandler.construct(
    "sendSdp",
    PayloadValidator,
    async (payload, roomData, roomWs) => {
      const { roomId } = roomData;
      const { senderMemberId, sdp } = payload;
      console.log(
        "TODO: Destructure the senderData and add it to the list of members on the page"
      );

      const conn = ManagedConnection.getFromMemberId(senderMemberId);
      if (conn) await conn.setRemoteDescription(sdp);
      else
        await createNewPcAndAnswerItAndSendToRoomWs({
          receiverMemberId: senderMemberId,
          roomWs,
          roomId,
          offerSdp: sdp,
          remoteStreamsManager,
          localStream,
        });
      promptPeerToSendIceCandidates({
        receiverMemberId: senderMemberId,
        roomId,
        roomWs,
      });
    }
  );
}

export default makeSendSdpActionHandler;
