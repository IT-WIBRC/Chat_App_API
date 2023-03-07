import { StatusCodes } from "http-status-codes";
import { ApiError } from "./api.error";

export class NotFound extends ApiError {
  constructor(path: string) {
    super(StatusCodes.NOT_FOUND, path);
  }
}
