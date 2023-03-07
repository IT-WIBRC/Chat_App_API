import { Request, Router } from "express";
import { isSessionHasExpired } from "../middlewares/sessionValidation";
import { UserController } from "../services";
import {
  assertRequiredLoginFieldsAreNotEmpty,
  assertRequiredRegisterFieldsAreNotEmpty,
  assertRequiredUpdateFieldsAreNotEmpty,
} from "../services/utils/auth.utils";
import { checkResetPasswordTokentExpiration } from "../middlewares/resetPassword";
import { validationResult } from "express-validator";
import { asyncWrapper } from "../middlewares/errors/asyncWrapper";
import { ApiError } from "../middlewares/errors/api.error";
import { StatusCodes } from "http-status-codes";

const userRouter = Router();
const userController = new UserController();

userRouter.post(
  "/create",
  assertRequiredRegisterFieldsAreNotEmpty,
  asyncWrapper(async (request: Request) => {
    const validator = validationResult(request);
    if (!validator.isEmpty()) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        validator.array({ onlyFirstError: true }).map((error) => error.msg)[0]
      );
    }
  }),
  userController.create
);
userRouter.post(
  "/login",
  assertRequiredLoginFieldsAreNotEmpty,
  asyncWrapper(async (request: Request) => {
    const validator = validationResult(request);
    if (!validator.isEmpty()) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        validator.array({ onlyFirstError: true }).map((error) => error.msg)[0]
      );
    }
  }),
  userController.login
);

userRouter.get("/all", isSessionHasExpired, userController.findAll);
userRouter.get("/", isSessionHasExpired, userController.findById);
userRouter.post(
  "/update",
  isSessionHasExpired,
  assertRequiredUpdateFieldsAreNotEmpty,
  asyncWrapper(async (request: Request) => {
    const validator = validationResult(request);
    if (!validator.isEmpty()) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        validator.array({ onlyFirstError: true }).map((error) => error.msg)[0]
      );
    }
  }),
  userController.update
);
userRouter.post("/reset-password-request", UserController.resetPasswordRequest);
userRouter.post(
  "/reset-password",
  checkResetPasswordTokentExpiration,
  UserController.resetPassword
);

export default userRouter;
