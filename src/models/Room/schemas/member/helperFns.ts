import generateNonce from "@utils/generateNonce";
import { SessionData } from "express-session";
import {
  AllowedRoomMember,
  ConnectedRoomMember,
  RoomMember,
} from "./index.schema";

function getMemberIdFromUserData(userData: SessionData["userData"]) {
  return userData.userId;
}

function generateRoomMemberData(
  userData: SessionData["userData"],
  isFirstMember: boolean
) {
  return {
    userData,
    memberId: getMemberIdFromUserData(userData),
    connectionId: undefined,
    nonce: generateNonce().nonce, // to verify identity in ws connection
    isAllowedInRoom: isFirstMember,
  };
}

function getIsMemberConnected(
  member: RoomMember
): member is ConnectedRoomMember {
  return !!member.connectionId;
}

function getIsMemberAllowed(member: RoomMember): member is AllowedRoomMember {
  return member.isAllowedInRoom && !!member.connectionId;
}

export {
  generateRoomMemberData,
  getIsMemberAllowed,
  getIsMemberConnected,
  getMemberIdFromUserData,
};
