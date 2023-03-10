import { NextFunction, Request, Response } from "express";
import { randomBytes } from "crypto";
import { PayloadSession, UserDTO, USER_FIELDS_TO_EXTRACT } from "../types/user";
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
import { asyncWrapper } from "../../../middlewares/errors/asyncWrapper";
import { ApiError } from "../../../middlewares/errors/api.error";
import { StatusCodes } from "http-status-codes";

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
    response: Response,
    next: NextFunction
  ): Promise<Response<UserDTO[]>> {
    return asyncWrapper(async () => {
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
        } else throw new ApiError(StatusCodes.CONFLICT, "User already exist");
      } else throw new ApiError(StatusCodes.CONFLICT, "User already exist");
    })(request, response, next);
  }

  async login(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<Response<UserDTO[]>> {
    return await asyncWrapper(async () => {
      const user = await UserController.findByEmail(
        request.body.email,
        USER_FIELDS_TO_EXTRACT.CODE_2
      );

      if (user) {
        const isSame: boolean = await comparePassword(
          request.body.password,
          user.passwordValue
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
        } else
          throw new ApiError(
            StatusCodes.BAD_REQUEST,
            "Wrong information provided"
          );
      } else throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    })(request, response, next);
  }

  async findAll(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<Response<UserDTO[]>> {
    return await asyncWrapper(async () => {
      const users = await UserService.findAll();
      return response.status(200).json(users);
    })(request, response, next);
  }

  async findById(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<Response<UserDTO>> {
    const userId = (parsedCookie(request.cookies.userInfo) as PayloadSession)
      .id;

    return asyncWrapper(async () => {
      const user = await UserService.findById(
        userId,
        USER_FIELDS_TO_EXTRACT.CODE_3
      );
      return response.status(200).json(user);
    })(request, response, next);
  }

  async update(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<Response<UserDTO>> {
    if (request.body.password) {
      return response.status(409).send("Not allow to update password here.");
    }

    const userId = (parsedCookie(request.cookies.userInfo) as PayloadSession)
      .id;
    return asyncWrapper(async () => {
      const user = await UserService.update(userId, request.body);
      if (user) {
        return response.status(200).json(user?.setAttributes("password", ""));
      }
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    })(request, response, next);
  }

  static async resetPasswordRequest(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<Response<UserDTO[]>> {
    if (!request.body.email) {
      return response.status(401).send("Email is required");
    }

    return asyncWrapper(async () => {
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
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    })(request, response, next);
  }

  static async resetPassword(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<Response<UserDTO[]>> {
    return asyncWrapper(async () => {
      const passwordResetToken = await TokenService.findByUserId(
        request.body.userId
      );
      if (!passwordResetToken) {
        throw new ApiError(
          StatusCodes.NOT_FOUND,
          "Invalid or expired password reset token"
        );
      }

      const isValid = await comparePassword(
        request.body.token,
        passwordResetToken.getDataValue("token")
      );
      if (!isValid) {
        throw new ApiError(
          StatusCodes.NOT_FOUND,
          "Invalid or expired password reset token"
        );
      }
      await UserService.update(request.body.userId, {
        password: request.body.password,
      });
      await passwordResetToken.destroy();
      return response.status(200).send("Password has been updated suceesfully");
    })(request, response, next);
  }
}
