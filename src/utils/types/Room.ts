import { z } from "zod";

type RoomId = string;
type RoomWsUrl = string;
type RoomMemberId = string;
type RoomNonce = string;
type RoomExpireAt = string;

type RoomUserData = {
  userId: string;
  username: string;
  verified: boolean;
};

const RoomValidators = {
  RoomMemberId: z.string() satisfies z.ZodSchema<RoomMemberId>,
  RoomUserData: z.object({
    userId: z.string(),
    username: z.string(),
    verified: z.boolean(),
  }) satisfies z.ZodSchema<RoomUserData>,
};

export type {
  RoomId,
  RoomWsUrl,
  RoomMemberId,
  RoomNonce,
  RoomExpireAt,
  RoomUserData,
};
export default RoomValidators;
