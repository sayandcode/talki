type ShowCase = { id: HTMLElement["id"]; isShown: true; msg: string };
type HideCase = { id: HTMLElement["id"]; isShown: false };

function toggleErrorDiv(args: ShowCase | HideCase): void {
  const { id, isShown } = args;
  const errorDiv = document.getElementById(id);
  if (!errorDiv) throw new Error(`Couldn't find ${id} error div`);

  errorDiv.style.display = isShown ? "block" : "none";
  if (isShown) errorDiv.textContent = args.msg || "";
}

export default toggleErrorDiv;
