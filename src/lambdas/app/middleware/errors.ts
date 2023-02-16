import { ErrorRequestHandler } from "express";

class ApiError {
  constructor(
    public readonly statusCode: number,
    public readonly msg: string
  ) {}
}

const errHandler: ErrorRequestHandler = (err, _, res, next) => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ msg: err.msg });
    next();
    return;
  }

  // eslint-disable-next-line no-console
  console.error(err, "\nServer still running");
  res.status(500).json({ msg: "Oops something went wrong" });
  next();
};
const errorMiddlewareArr = [errHandler] as const;

export default errorMiddlewareArr;
export { ApiError };
