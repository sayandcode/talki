import RoomValidators from "utils/types/Room";
import { z } from "zod";
import MessageActionHandler from ".";
import ManagedConnection from "../managedConnection";
import getIceEventHandler from "./_utils/iceEventHandler";
import sendSdpToRoomWs from "./_utils/sendSdpToRoomWs";

const PayloadValidator = z.object({
  newMemberId: RoomValidators.RoomMemberId,
});

const promptSdpActionHandler = MessageActionHandler.construct(
  "promptSdp",
  PayloadValidator,
  async (payload, roomData, roomWs) => {
    const { newMemberId } = payload;
    const { roomId } = roomData;

    const conn = new ManagedConnection(newMemberId);
    const iceEventHandler = getIceEventHandler({
      roomWs,
      conn,
      roomId,
      receiverMemberId: newMemberId,
    });
    conn.setupIceListener(iceEventHandler);

    const offerSdp = await conn.createOffer();
    sendSdpToRoomWs({
      roomWs,
      sdp: offerSdp,
      receiverMemberId: newMemberId,
      roomId,
    });
  }
);

export default promptSdpActionHandler;
