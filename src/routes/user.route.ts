import { Router } from "express";
import { UserController } from "../services";
import {
  assertRequiredLoginFieldsIsNotEmpty,
  assertRequiredRegisterFieldsIsNotEmpty,
} from "../services/modules/utils/user.utils";

const userRouter = Router();
const userController = new UserController();

userRouter.post(
  "/create",
  assertRequiredRegisterFieldsIsNotEmpty,
  userController.create
);
userRouter.post(
  "/login",
  assertRequiredLoginFieldsIsNotEmpty,
  userController.login
);

userRouter.get("/all", userController.findAll);

export default userRouter;
