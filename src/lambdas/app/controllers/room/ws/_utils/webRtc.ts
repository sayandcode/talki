import { z } from "zod";

type WebRtcTypes = {
  Sdp: {
    type: string;
    sdp: string;
  };
};

const WebRtcValidators = {
  sdp: z.object({
    type: z.string(),
    sdp: z.string(),
  }) satisfies z.ZodType<WebRtcTypes["Sdp"]>,
};

export { WebRtcTypes, WebRtcValidators };
