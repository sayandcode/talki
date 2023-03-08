import { z } from "zod";

type WebRtcTypes = {
  Sdp: {
    type: string;
    sdp: string;
  };
  StringifiedIceCandidate: string;
};

const WebRtcValidators = {
  sdp: z.object({
    type: z.string(),
    sdp: z.string(),
  }) satisfies z.ZodType<WebRtcTypes["Sdp"]>,

  stringifiedIceCandidate: z.string() satisfies z.ZodType<
    WebRtcTypes["StringifiedIceCandidate"]
  >,
};

export { WebRtcTypes, WebRtcValidators };
