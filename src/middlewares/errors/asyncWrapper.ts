import { Request, Response, NextFunction } from "express";

type AsyncFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<unknown>;

export const asyncWrapper =
  (hander: AsyncFunction): any =>
    (req: Request, res: Response, next: NextFunction): void => {
      Promise.resolve(hander(req, res, next)).catch((err) => next(err));
    };
