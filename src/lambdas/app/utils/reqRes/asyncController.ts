import { RequestHandler } from "express";

/**
 * @param asyncFn An async function that contains the controller logic
 * @returns An async function wrapper that catches any uncaught errors in the given controller, and passes them to the error middleware. This ensures that the application doesn't crash, and also gives us reports of unexpected bugs
 */
function makeAsyncController(
  asyncFn: (...args: Parameters<RequestHandler>) => Promise<unknown>
) {
  const wrapperFn: RequestHandler = (req, res, next) => {
    asyncFn(req, res, next).catch(next);
  };
  return wrapperFn;
}

export default makeAsyncController;
