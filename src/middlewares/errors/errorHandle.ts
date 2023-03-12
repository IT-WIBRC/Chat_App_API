import { NextFunction, Request, Response } from "express";
import { ApiError } from "./api.error";

export default class ErrorHandler {
  static handle = () => {
    return async (
      err: ApiError,
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      const statusCode = err.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        message: err.message,
        stack: err.stack,
      });
    };
  };
}
