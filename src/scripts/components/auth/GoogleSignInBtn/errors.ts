import toggleErrorDiv from "utils/functions/errors";

const GOOGLE_SIGN_IN_ERROR_DIV_ID = "google-sign-in-error";

function toggleGoogleSignInError(
  ...[isShown, msg]: [isShown: false] | [isShown: true, msg: string]
) {
  const id = GOOGLE_SIGN_IN_ERROR_DIV_ID;
  toggleErrorDiv(isShown ? { id, isShown, msg } : { id, isShown });
}

export default toggleGoogleSignInError;
export { GOOGLE_SIGN_IN_ERROR_DIV_ID };
