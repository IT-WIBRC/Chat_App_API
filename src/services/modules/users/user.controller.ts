import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { UserDTO, UserError, USER_FIELDS_TO_EXTRACT } from "../types/user";
import { comparePassword, generateToken, hashPassword } from "../utils/user.utils";
import UserService from "./user.service";

export default class UserController {
    constructor() {}

    async create(request: Request, response: Response): Promise<Response<UserDTO[]>> {
        const validator = validationResult(request);
        if (!validator.isEmpty()) {
          return response.status(400).send(validator.array({ onlyFirstError: true }).map((error) => error.msg)[0]);
        }
    
        try {
            const myUserByEmail = await UserService.findByEmail(request.body.email, USER_FIELDS_TO_EXTRACT.CODE_0);
            if (!myUserByEmail) {
              const myUserByUsername = await UserService.findByUserName(
                request.body.username,
                USER_FIELDS_TO_EXTRACT.CODE_1
              );
              if (!myUserByUsername) {
                const saltPassword: string = await hashPassword(request.body.password);
                console.log(request.body);
                
                const newUser = await UserService.create({
                    ...request.body,
                    password: saltPassword,
                });
                return response.status(201).send(newUser.userId);
              } else return response.status(409).send(UserError.USER_409);
            } else return response.status(409).send(UserError.USER_409);
          } catch (error) {
            console.log(error);
            
            return response.status(500).send("SERVER_500");
          } 
    }

    async login(request: Request, response: Response): Promise<Response<UserDTO[]>> {
        const loginValidator = validationResult(request);
        if (!loginValidator.isEmpty()) {
          return response.status(400).send(loginValidator.array({ onlyFirstError: true }).map((error) => error.msg)[0]);
        }
    
        try {
          const user = await UserService.findByEmail(request.body.email, USER_FIELDS_TO_EXTRACT.CODE_2);
          if (user) {
            const isSame: boolean = await comparePassword(request.body.password, user.getDataValue("password"));
            if (isSame) {
              const token = generateToken({
                id: user.getDataValue("userId"),
                profile: {
                  email: user.getDataValue("email"),
                  username: user.getDataValue("username"),
                  name: user.getDataValue("name")
                },
              });
              return response.status(200).cookie("token", token).send(user.setAttributes("password", ""));
            } else return response.status(401).send(UserError.USER_401);
          } else return response.status(404).send(UserError.USER_404);
        } catch (error) {
          return response.status(500).send("SERVER_500");
        }
      }

    async findAll(request: Request, response: Response): Promise<Response<UserDTO[]>> {
        const users = await UserService.findAll();
        return response.status(200).json(users);
    }
}