import { z } from "zod";
import { ApiError } from "middleware/errors";
import { processAnonUser, processGoogleUser } from "./processUser";
import AuthLoginBodyValidator from "./validators";

type ProcessAuthLoginBodyReturnType = Promise<
  ReturnType<typeof processAnonUser> | ReturnType<typeof processGoogleUser>
>;

async function processAuthLoginBody({
  parsedBody,
  sessionId,
  nonce,
}: {
  parsedBody: z.infer<typeof AuthLoginBodyValidator>;
  sessionId: Parameters<typeof processAnonUser>[1];
  nonce: Parameters<typeof processGoogleUser>[1];
}): ProcessAuthLoginBodyReturnType {
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
      };
  }
}

export default processAuthLoginBody;
