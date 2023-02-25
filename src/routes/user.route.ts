import { Router } from "express";
import { UserController } from "../services";

const userRouter = Router();
const userController = new UserController();

userRouter.post("/create", userController.create);
userRouter.get("/all", userController.findAll);

export default userRouter;