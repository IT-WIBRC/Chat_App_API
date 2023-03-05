import { Router } from "express";
import { isSessionHasExpired } from "../middlewares/sessionValidation";
import { UserController } from "../services";
import {
  assertRequiredLoginFieldsAreNotEmpty,
  assertRequiredRegisterFieldsAreNotEmpty,
  assertRequiredUpdateFieldsAreNotEmpty,
} from "../services/utils/auth.utils";
import { checkResetPasswordTokentExpiration } from "../middlewares/resetPassword";

const userRouter = Router();
const userController = new UserController();

userRouter.post(
  "/create",
  assertRequiredRegisterFieldsAreNotEmpty,
  userController.create
);
userRouter.post(
  "/login",
  assertRequiredLoginFieldsAreNotEmpty,
  userController.login
);

userRouter.get("/all", isSessionHasExpired, userController.findAll);
userRouter.get("/", isSessionHasExpired, userController.findById);
userRouter.post(
  "/update",
  isSessionHasExpired,
  assertRequiredUpdateFieldsAreNotEmpty,
  userController.update
);
userRouter.post("/reset-password-request", UserController.resetPasswordRequest);
userRouter.post(
  "/reset-password",
  checkResetPasswordTokentExpiration,
  UserController.resetPassword
);

export default userRouter;
