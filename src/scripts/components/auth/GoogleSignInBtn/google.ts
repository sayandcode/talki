import { getNonce, processGoogleToken } from "./backend";
import toggleError from "./errors";

declare const google: any;

const NONCE_TIMEOUT = 1000 * 60 * 2; // 2 min

function initializeGoogleSignIn() {
  const googleClientId = import.meta.env.PUBLIC_GOOGLE_CLIENT_ID;
  const isIdValid = !!googleClientId && typeof googleClientId === "string";
  if (!isIdValid) throw new Error("Google client Id not set in env variables");

  const googleBtnContainer = document.getElementById("google-btn-container");
  const googleInitOptions = {
    client_id: googleClientId,
    callback: processGoogleToken,
    context: "signin",
    ux_mode: "popup",
  };
  const googleBtnOptions = {
    type: "standard",
    shape: "rectangular",
    theme: "outline",
    text: "continue_with",
    size: "large",
    logo_alignment: "left",
    width: 250,
  };

  setupLoginFlow();
  setInterval(setupLoginFlow, NONCE_TIMEOUT);

  function setupLoginFlow() {
    getNonce()
      .then((nonce) => {
        google.accounts.id.initialize({ ...googleInitOptions, nonce });
        google.accounts.id.renderButton(googleBtnContainer, googleBtnOptions);
      })
      .catch(() =>
        toggleError(true, "Something went wrong. Try refreshing the page")
      );
  }
}

export default initializeGoogleSignIn;
