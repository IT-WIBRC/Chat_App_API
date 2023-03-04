import { NextFunction, Request, Response } from "express";
import configs from "../config/env.config";
import { parsedCookie } from "../services/utils/auth.utils";

const { Encrypt_key } = configs;

export const isSessionHasExpired = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  if (parsedCookie(request.cookies.userInfo).key === Encrypt_key) {
    next();
  } else response.status(401).send("Your session has expired.");
};
