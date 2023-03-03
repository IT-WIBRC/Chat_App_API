import { Optional } from "sequelize";
import { ConversationDTO } from "../";

export enum ROLE {
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
  USER = "USER",
}

export interface UserDTO {
  userId: string;
  name: string;
  username: string;
  password: string;
  role: ROLE;
  email: string;
  conversations: ConversationDTO[];
  createdAt?: string;
  updatedAt?: string;
}

export type UserCreationDTO = Optional<UserDTO, "userId" | "role">;

export enum USER_FIELDS_TO_EXTRACT {
  CODE_1 = "fieldToExtactCode_1",
  CODE_2 = "fieldToExtactCode_2",
  CODE_0 = "fieldToExtactCode_0",
}

export enum UserError {
  USER_409 = "USER-409",
  USER_404 = "USER-404",
  USER_401 = "USER-401",
  USER_400 = "USER-400",
}
// 409: conflicts (username or email is already used)
// 404:
// 401: Bad request
