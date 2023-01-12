import { z } from "zod";
import { ApiError } from "middleware/errors";
import { processAnonUser, processGoogleUser } from "./processUser";
import AuthLoginBodyValidator from "./validators";

async function processAuthLoginBody({
  parsedBody,
  sessionId,
  nonce,
}: {
  parsedBody: z.infer<typeof AuthLoginBodyValidator>;
  sessionId: Parameters<typeof processAnonUser>[1];
  nonce: Parameters<typeof processGoogleUser>[1];
}) {
  switch (parsedBody.type) {
    case "anon": {
      const { name } = parsedBody;
      return processAnonUser(name, sessionId);
    }
    case "google": {
      const { idToken } = parsedBody;
      return processGoogleUser(idToken, nonce);
    }
    default:
      return {
        success: false,
        error: new ApiError(400, "Invalid schema in request body"),
      } as const satisfies
        | Awaited<ReturnType<typeof processAnonUser>>
        | Awaited<ReturnType<typeof processGoogleUser>>;
  }
}

export default processAuthLoginBody;
