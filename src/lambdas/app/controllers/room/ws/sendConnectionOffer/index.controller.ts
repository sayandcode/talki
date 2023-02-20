import { ApiError } from "@appLambda/middleware/errors";
import DatabaseClients from "@appLambda/services/db";
import { getIsMemberAllowed } from "models/Room/schemas/member/helperFns";
import makeRoomWsController from "../_utils/makeRoomWsController";
import RoomWsSendConnectionOfferBodyValidator from "./_utils/bodyValidator";
import sendOffer from "./_utils/sendOffer";

function makeRoomWsSendConnectionOffer(databaseClients: DatabaseClients) {
  return makeRoomWsController(
    databaseClients,
    RoomWsSendConnectionOfferBodyValidator,
    async (reqData, res, next) => {
      const {
        requestingMember: offeringMember,
        requestedRoom,
        reqBody: { newMemberId, offerSdp },
      } = reqData;

      // are both members allowed in room?
      const answeringMember = requestedRoom.members.get(newMemberId);
      const isAnswererAllowedInRoom =
        answeringMember && getIsMemberAllowed(answeringMember);
      const isBothMembersAllowedInRoom =
        getIsMemberAllowed(offeringMember) && isAnswererAllowedInRoom;
      if (!isBothMembersAllowedInRoom) {
        const msg =
          "This message can only be sent between allowed members of room";
        next(new ApiError(403, msg));
        return;
      }

      await sendOffer({ offeringMember, answeringMember, offerSdp });
      res.status(200).send("Offer sent");
    }
  );
}

export default makeRoomWsSendConnectionOffer;
