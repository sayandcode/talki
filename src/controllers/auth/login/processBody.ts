import { z } from "zod";
import { Request } from "express";
import { processAnonUser, processGoogleUser } from "./processUser";
import AuthLoginBodyValidator from "./validators";

async function processAuthLoginBody({
  parsedBody,
  req,
}: {
  parsedBody: z.infer<typeof AuthLoginBodyValidator>;
  req: Request;
}) {
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
      throw new Error(
        "Something went wrong in validating request body with zod"
      );
  }
}

export default processAuthLoginBody;
