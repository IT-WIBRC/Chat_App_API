import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { UserDTO, UserError, USER_FIELDS_TO_EXTRACT } from "../types/user";
import {
  comparePassword,
  createCookie,
  hashPassword,
  parsedCookie,
} from "../../utils/auth.utils";
import UserService from "./user.service";
import dayjs from "dayjs";
import configs from "../../../config/env.config";
import { User } from "..";

const { DOMAIN } = configs;

export default class UserController {
  static async findByEmail(
    email: string,
    code: USER_FIELDS_TO_EXTRACT
  ): Promise<User | null> {
    return await UserService.findByEmail(email, code);
  }

  static async findByUsername(
    username: string,
    code: USER_FIELDS_TO_EXTRACT
  ): Promise<User | null> {
    return await UserService.findByUserName(username, code);
  }

  async create(
    request: Request,
    response: Response
  ): Promise<Response<UserDTO[]>> {
    const validator = validationResult(request);
    if (!validator.isEmpty()) {
      return response
        .status(409)
        .send(
          validator.array({ onlyFirstError: true }).map((error) => error.msg)[0]
        );
    }

    try {
      const myUserByEmail = await UserController.findByEmail(
        request.body.email,
        USER_FIELDS_TO_EXTRACT.CODE_0
      );

      if (!myUserByEmail) {
        const myUserByUsername = await UserController.findByUsername(
          request.body.username,
          USER_FIELDS_TO_EXTRACT.CODE_1
        );
        if (!myUserByUsername) {
          const passwordHashed: string = await hashPassword(
            request.body.password
          );

          const newUser = await UserService.create({
            ...request.body,
            password: passwordHashed,
          });
          return response.status(201).send(newUser.userId);
        } else return response.status(409).send(UserError.USER_409);
      } else return response.status(409).send(UserError.USER_409);
    } catch (error) {
      console.log(error);
      return response.status(500).send("SERVER_500");
    }
  }

  async login(
    request: Request,
    response: Response
  ): Promise<Response<UserDTO[]>> {
    const loginValidation = validationResult(request);
    if (!loginValidation.isEmpty()) {
      return response
        .status(409)
        .send(
          loginValidation
            .array({ onlyFirstError: true })
            .map((error) => error.msg)[0]
        );
    }

    try {
      const user = await UserController.findByEmail(
        request.body.email,
        USER_FIELDS_TO_EXTRACT.CODE_2
      );

      if (user) {
        const isSame: boolean = await comparePassword(
          request.body.password,
          user.getDataValue("password")
        );

        if (isSame) {
          return response
            .cookie("userInfo", JSON.stringify(createCookie(user)), {
              httpOnly: true,
              secure: process.env.NODE_ENV === "development" ? false : true,
              expires: dayjs().add(30, "days").toDate(),
              domain: DOMAIN,
            })
            .status(200)
            .send(user.setAttributes("password", ""));
        } else return response.status(401).send(UserError.USER_401);
      } else return response.status(404).send(UserError.USER_404);
    } catch (error) {
      return response.status(500).send("SERVER_500");
    }
  }

  async findAll(_: Request, response: Response): Promise<Response<UserDTO[]>> {
    const users = await UserService.findAll();
    return response.status(200).json(users);
  }

  async findById(
    request: Request,
    response: Response
  ): Promise<Response<UserDTO>> {
    const userId = parsedCookie(request.cookies.userInfo).id;

    try {
      const user = await UserService.findById(
        userId,
        USER_FIELDS_TO_EXTRACT.CODE_3
      );
      return response.status(200).json(user);
    } catch (error) {
      return response.status(404).send("User not found");
    }
  }

  async update(
    request: Request,
    response: Response
  ): Promise<Response<UserDTO>> {
    if (request.body.password) {
      return response.status(409).send("Not allow to update password here.");
    }

    const loginValidation = validationResult(request);
    if (!loginValidation.isEmpty()) {
      return response
        .status(409)
        .send(
          loginValidation
            .array({ onlyFirstError: true })
            .map((error) => error.msg)[0]
        );
    }

    const userId = parsedCookie(request.cookies.userInfo).id;
    try {
      const user = await UserService.update(userId, request.body);
      if (user) {
        return response.status(200).json(user?.setAttributes("password", ""));
      }
      return response.status(404).send("User not found");
    } catch (error) {
      return response.status(500).send("Server error please retry again");
    }
  }

  static async resetPassword(
    request: Request,
    response: Response
  ): Promise<Response<UserDTO[]>> {
    const loginValidation = validationResult(request);
    if (!loginValidation.isEmpty()) {
      return response
        .status(409)
        .send(
          loginValidation
            .array({ onlyFirstError: true })
            .map((error) => error.msg)[0]
        );
    }

    try {
      const user = await UserController.findByEmail(
        request.body.email,
        USER_FIELDS_TO_EXTRACT.CODE_0
      );

      if (user) {
        const passwordHashed: string = await hashPassword(
          request.body.password
        );
        await UserService.update(user.getDataValue("userId"), {
          password: passwordHashed,
        });

        return response
          .status(200)
          .send("Password has been updated suceesfully");

        return response.status(404).send("User not found");
      }
      return response.status(404).send("User not found");
    } catch (error) {
      return response.status(500).send("Server Error");
    }
  }
}
