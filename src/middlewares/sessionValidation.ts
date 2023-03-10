import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import configs from "../config/env.config";
import { PayloadSession } from "../services/modules/types/user";
import { parsedCookie } from "../services/utils/auth.utils";
import { ApiError } from "./errors/api.error";
import { asyncWrapper } from "./errors/asyncWrapper";

const { Encrypt_key } = configs;

export const isSessionHasExpired = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  asyncWrapper(async () => {
    let cookieInfo = request.cookies.userInfo;
    if (!cookieInfo) {
      throw new ApiError(StatusCodes.FORBIDDEN, "Your session has expired.");
    }
    cookieInfo = parsedCookie(request.cookies.userInfo);
    if ((cookieInfo as PayloadSession).key === Encrypt_key) {
      next();
    } else {
      throw new ApiError(StatusCodes.FORBIDDEN, "Your session has expired.");
    }
  })(request, response, next);
};
