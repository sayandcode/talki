import toggleErrorDiv from "utils/functions/errors";

const ANON_SIGN_IN_ERROR_DIV_ID = "anon-sign-in-error";

function toggleAnonSignInError(
  ...[isShown, msg]: [isShown: false] | [isShown: true, msg: string]
) {
  const id = ANON_SIGN_IN_ERROR_DIV_ID;
  toggleErrorDiv(isShown ? { id, isShown, msg } : { id, isShown });
}

export default toggleAnonSignInError;
export { ANON_SIGN_IN_ERROR_DIV_ID };
