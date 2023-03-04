import { NextFunction, Request, Response } from "express";

export const xstAttackBlocker = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  // NOTE: Exclude TRACE and TRACK methods to avoid XST attacks.
  const allowedMethods = [
    "OPTIONS",
    "HEAD",
    "CONNECT",
    "GET",
    "POST",
    "PUT",
    "DELETE",
    "PATCH",
  ];

  if (allowedMethods.includes(request.method)) {
    next();
  } else response.status(405).send(`${request.method} not allowed.`);
};
