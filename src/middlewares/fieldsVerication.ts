import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "./errors/api.error";
import { asyncWrapper } from "./errors/asyncWrapper";

export const handleFieldsValidation = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  asyncWrapper(async () => {
    const validator = validationResult(request);
    if (!validator.isEmpty()) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        validator.array({ onlyFirstError: true }).map((error) => error.msg)[0]
      );
    }
    next();
  })(request, response, next);
};
