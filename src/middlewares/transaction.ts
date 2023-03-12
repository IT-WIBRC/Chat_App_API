import { NextFunction, Request, Response } from "express";
import { dbNamespace, sequelizeConnection } from "../services/database/config";
import onFinished from "on-finished";
import { ApiError } from "./errors/api.error";
import { StatusCodes } from "http-status-codes";

export const transactionMiddleWare = (
  request: Request,
  response: Response,
  next: NextFunction
): void => {
  if (request.method !== "GET") {
    dbNamespace.bindEmitter(request);
    dbNamespace.bindEmitter(response);
    dbNamespace.bind(next);

    dbNamespace.run(async () => {
      try {
        const transaction = await sequelizeConnection.transaction();
        dbNamespace.set("transaction", transaction);
        onFinished(response, (err: unknown) => {
          if (!err) {
            transaction.commit();
          } else {
            transaction.rollback();
            throw new ApiError(
              StatusCodes.BAD_GATEWAY,
              (err as { message: string }).message
            );
          }
        });
        next();
      } catch (error: unknown) {
        console.log(error);
        next(error as ApiError);
      }
    });
  } else next();
};
