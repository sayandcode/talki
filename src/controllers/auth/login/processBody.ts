import { z } from "zod";
import { Request } from "express";
import { ApiError } from "middleware/errors";
import { processAnonUser, processGoogleUser } from "./processUser";
import AuthLoginBodyValidator from "./validators";

type ProcessAuthLoginBodyReturnType = Promise<
  ReturnType<typeof processAnonUser> | ReturnType<typeof processGoogleUser>
>;

async function processAuthLoginBody({
  parsedBody,
  req,
}: {
  parsedBody: z.infer<typeof AuthLoginBodyValidator>;
  req: Request;
}): ProcessAuthLoginBodyReturnType {
  switch (parsedBody.type) {
    case "anon": {
      const { name } = parsedBody;
      return processAnonUser(name, req.sessionID);
    }
    case "google": {
      const { idToken } = parsedBody;
      return processGoogleUser(idToken, req.headers.cookie);
    }
    default:
      return {
        success: false,
        error: new ApiError(400, "Invalid schema in request body"),
      };
  }
}

export default processAuthLoginBody;
