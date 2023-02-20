import { ApiError } from "@appLambda/middleware/errors";
import { RequestHandler } from "express";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { ParamsDictionary } from "express-serve-static-core";

type GenericBody = Record<string, any>;

type ControllerArgs<BodySchema extends GenericBody = GenericBody> = Parameters<
  RequestHandler<ParamsDictionary, any, BodySchema>
>;

type ControllerFn<BS extends GenericBody> = (
  ...args: ControllerArgs<BS>
) => any;

function makeTypedBodyController<
  ValidatorSchema extends z.ZodSchema,
  CF extends ControllerFn<z.infer<ValidatorSchema>>
>(
  Validator: ValidatorSchema,
  controller: CF
): (...args: ControllerArgs) => ReturnType<CF> {
  return (req, res, next) => {
    const bodyParseResult = Validator.safeParse(req.body);
    if (!bodyParseResult.success) {
      const errMsg = fromZodError(bodyParseResult.error).message;
      next(new ApiError(400, errMsg));

      const errReturnVal = getIsControllerAsync(controller)
        ? Promise.resolve()
        : undefined;
      return errReturnVal;
    }
    return controller(req, res, next);
  };
}

function getIsControllerAsync(controller: ControllerFn<any>) {
  return controller.constructor.name === "AsyncFunction";
}

export default makeTypedBodyController;
