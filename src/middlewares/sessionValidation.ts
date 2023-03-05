import { NextFunction, Request, Response } from "express";
import configs from "../config/env.config";
import { PayloadSession } from "../services/modules/types/user";
import { parsedCookie } from "../services/utils/auth.utils";

const { Encrypt_key } = configs;

export const isSessionHasExpired = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const cookieInfo = parsedCookie(request.cookies.userInfo);
  if (cookieInfo === false) {
    response.status(401).send("Your session has expired.");
  } else {
    if ((cookieInfo as PayloadSession).key === Encrypt_key) {
      next();
    } else response.status(401).send("Your session has expired.");
  }
};
