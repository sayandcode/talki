/** This function returns the element, if it exists
 * or throws an error if it doesn't
 */
function getElById<ElType extends HTMLElement>(id: HTMLElement["id"]): ElType {
  const el = document.getElementById(id) as ElType;
  if (!el) throw new Error("Element not found on page");
  return el;
}

export default getElById;
