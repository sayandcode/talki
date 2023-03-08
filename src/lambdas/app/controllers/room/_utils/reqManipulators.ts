import { Request } from "express";

/**
 * Get the userData from the session, hoping that user is authed
 */
function getUserDataFromAuthedReq(req: Request) {
  const { userData } = req.session;
  if (!userData)
    throw new Error(
      "This route should be allowed only for authenticated users"
    );
  return userData;
}

// eslint-disable-next-line import/prefer-default-export
export { getUserDataFromAuthedReq };
