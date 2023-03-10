import { Router } from "express";
import { isSessionHasExpired } from "../middlewares/sessionValidation";
import { UserController } from "../services";
import {
  assertRequiredLoginFieldsAreNotEmpty,
  emailValidation,
  passwordValidation,
  usernameValidation,
  nameValidation,
} from "../services/utils/auth.utils";
import { checkResetPasswordTokentExpiration } from "../middlewares/resetPassword";
import { handleFieldsValidation } from "../middlewares/fieldsVerication";

const userRouter = Router();
const userController = new UserController();

userRouter.post(
  "/create",
  emailValidation,
  passwordValidation,
  usernameValidation,
  nameValidation,
  handleFieldsValidation,
  userController.create
);
userRouter.post(
  "/login",
  assertRequiredLoginFieldsAreNotEmpty,
  handleFieldsValidation,
  userController.login
);

userRouter.get("/all", isSessionHasExpired, userController.findAll);
userRouter.get("/", isSessionHasExpired, userController.findById);
userRouter.put(
  "/update",
  isSessionHasExpired,
  emailValidation,
  usernameValidation,
  nameValidation,
  handleFieldsValidation,
  userController.update
);
userRouter.post(
  "/reset-password-request",
  emailValidation,
  handleFieldsValidation,
  UserController.resetPasswordRequest
);
userRouter.post(
  "/reset-password",
  checkResetPasswordTokentExpiration,
  passwordValidation,
  handleFieldsValidation,
  UserController.resetPassword
);

export default userRouter;
