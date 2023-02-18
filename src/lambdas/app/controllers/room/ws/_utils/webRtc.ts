import { z } from "zod";

type WebRtcTypes = {
  Sdp: string;
};

const WebRtcValidators = {
  sdp: z.string() satisfies z.ZodType<WebRtcTypes["Sdp"]>,
};

export { WebRtcTypes, WebRtcValidators };
