function toggleGoogleSignInError(isShown: boolean, msg?: string) {
  const errorDiv = document.getElementById("google-sign-in-error");
  if (!errorDiv) throw new Error("Couldn't find google sign in error div");

  errorDiv.textContent = msg || "";
  errorDiv.style.display = isShown ? "block" : "hidden";
}

export default toggleGoogleSignInError;
