import { NextFunction, Request, Response } from "express";
import {
  checkToken,
  TOKEN_ERROR,
  EXP_TOKEN,
} from "../services/utils/auth.utils";
import configs from "../config/env.config";

const { RESET_PASSWORD_KEY } = configs;

export const checkResetPasswordTokentExpiration = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const tokenToverify = checkToken(request.body.token, RESET_PASSWORD_KEY);
  switch (tokenToverify) {
    case TOKEN_ERROR.EXPIRED:
      return response.status(401).send("Token has expired");
    case TOKEN_ERROR.ACTIVE:
      return response.status(401).send("Status expired");
    case TOKEN_ERROR.INVALID:
      return response.status(401).send("Invalid token expired");
    case TOKEN_ERROR.OTHER:
      return response.status(401).send("Token error");
    default:
      request.body.token = (tokenToverify as EXP_TOKEN).token;
      console.log(tokenToverify);

      return next();
  }
};
