import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { randomBytes } from "crypto";
import {
  PayloadSession,
  UserDTO,
  UserError,
  USER_FIELDS_TO_EXTRACT,
} from "../types/user";
import {
  comparePassword,
  createCookie,
  generateToken,
  parsedCookie,
} from "../../utils/auth.utils";
import UserService from "./user.service";
import configs from "../../../config/env.config";
import { User } from "..";
import { sendEmail } from "../../externals/mails/mail.utils";
import { HTML_TEMPLATE } from "../../externals/mails/templates/welcome";
import { SESSION_EXPIRATION } from "../../utils/constant";
import { TokenService } from "../token/token.service";
import { HTML_TEMPLATE_RESET_PASSWORD } from "../../externals/mails/templates/reset-password";

const { DOMAIN, CLIENT_URL, API_PREFIX, RESET_PASSWORD_KEY } = configs;

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
          const newUser = await UserService.create({
            ...request.body,
          });
          sendEmail(
            {
              to: newUser.email,
              subject: "Welcome to this application.",
              html: HTML_TEMPLATE(
                "DT(Dicuss Together)",
                newUser.name,
                newUser.email
              ),
            },
            (info: unknown) => {
              console.log(info);
            }
          );
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
            .cookie(
              "userInfo",
              JSON.stringify(generateToken(createCookie(user))),
              {
                httpOnly: true,
                secure: process.env.NODE_ENV === "development" ? false : true,
                expires: SESSION_EXPIRATION.toDate(),
                domain: DOMAIN,
              }
            )
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
    const userId = (parsedCookie(request.cookies.userInfo) as PayloadSession)
      .id;

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

    const userId = (parsedCookie(request.cookies.userInfo) as PayloadSession)
      .id;
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

  static async resetPasswordRequest(
    request: Request,
    response: Response
  ): Promise<Response<UserDTO[]>> {
    if (!request.body.email) {
      return response.status(401).send("Email is required");
    }

    try {
      const user = await UserController.findByEmail(
        request.body.email,
        USER_FIELDS_TO_EXTRACT.CODE_0
      );

      if (user) {
        const token = await TokenService.findByUserId(
          user.getDataValue("userId")
        );
        if (token) await token.destroy();
        const resetToken = randomBytes(32).toString("hex");

        await TokenService.create({
          userId: user.getDataValue("userId"),
          token: resetToken,
        });

        sendEmail(
          {
            to: request.body.email,
            subject: "Reset password link",
            html: HTML_TEMPLATE_RESET_PASSWORD(
              "Reset Password email",
              user.getDataValue("userId"),
              generateToken({ token: resetToken }, RESET_PASSWORD_KEY, "1h"),
              CLIENT_URL as string,
              API_PREFIX as string
            ),
          },
          (info: unknown) => {
            console.log(info);
          }
        );
        return response
          .status(200)
          .send("Reset password email has been sent successfully");
      }
      return response.status(404).send("User not found");
    } catch (error) {
      return response.status(500).send("Server Error");
    }
  }

  static async resetPassword(
    request: Request,
    response: Response
  ): Promise<Response<UserDTO[]>> {
    const passwordResetToken = await TokenService.findByUserId(
      request.body.userId
    );
    if (!passwordResetToken) {
      return response
        .status(400)
        .send("Invalid or expired password reset token");
    }

    const isValid = await comparePassword(
      request.body.token,
      passwordResetToken.getDataValue("token")
    );
    if (!isValid) {
      return response
        .status(400)
        .send("Invalid or expired password reset token");
    }

    if (!request.body.password) {
      return response.status(400).send("Password is required");
    }
    try {
      await UserService.update(request.body.userId, {
        password: request.body.password,
      });
      await passwordResetToken.destroy();
      return response.status(200).send("Password has been updated suceesfully");
    } catch (error) {
      return response.status(500).send("Server Error");
    }
  }
}
