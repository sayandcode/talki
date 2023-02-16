import { z } from "zod";

const RoomIdValidator = z.string().length(24);

// eslint-disable-next-line import/prefer-default-export
export { RoomIdValidator };
