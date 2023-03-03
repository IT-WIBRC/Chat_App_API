import { hash, compare } from "bcrypt";
import { checkSchema } from "express-validator";
import { sign, verify } from "jsonwebtoken";
import configs from "../../../config/env.config";
import { UserDTO, USER_FIELDS_TO_EXTRACT } from "../types/user";

const SALBOUND = 10;
const { Encrypt_key: JWT_KEY } = configs;

type Payload = {
  id: string;
  profile: {
    username: string;
    email: string;
    name: string;
    role?: string;
  };
};

export const hashPassword = async (password: string): Promise<string> =>
  await hash(password, SALBOUND);

export const comparePassword = async (
  passwordToCompared: string,
  password: string
): Promise<boolean> => await compare(passwordToCompared, password);

export const generateToken = (payload: Payload): string =>
  sign(payload, JWT_KEY as string, {
    algorithm: "HS512",
    expiresIn: "1h",
  });

export const checkToken = (token: string): Payload | null | string => {
  let parsedToken: Payload | null = null;
  let errotMessage = "";
  verify(token, JWT_KEY as string, (err, parsed): void => {
    if (err) {
      switch (err.name) {
        case "TokenExpiredError":
          errotMessage = "Token has expired";
          break;
        case "JsonWebTokenError":
          errotMessage = "Invalid token";
          break;
        case "NotBeforeError":
          errotMessage = "Token is not active";
          break;
        default:
          errotMessage = "Other Error";
          break;
      }
    } else parsedToken = parsed as Payload;
  });
  return errotMessage ? errotMessage : parsedToken;
};

export const assertRequiredRegisterFieldsIsNotEmpty = checkSchema({
  email: {
    exists: {
      errorMessage: "Email is required",
    },
    isEmail: {
      bail: true,
      errorMessage: "Email is in wrong format",
    },
  },
  username: {
    exists: {
      errorMessage: "Username is required",
    },
    trim: true,
    isLength: {
      errorMessage: "Username must have length less than 9",
      options: { max: 8 },
    },
    matches: {
      errorMessage:
        "Username must be alphanumeric character and can contain (#!@$%&()+=) as special characters",
      options: new RegExp(
        "(^(?=.*?[A-Z])?(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#!@$%&()+=])?.{4,10})",
        "g"
      ),
    },
  },
  name: {
    exists: {
      errorMessage: "name is required",
    },
    trim: true,
    isLength: {
      errorMessage: "Name must have length less than 6",
      options: { max: 6 },
    },
  },
  password: {
    exists: {
      errorMessage: "Password is required",
    },
    trim: true,
    isLength: {
      errorMessage: "Password must have at least 8 character",
      options: { min: 8 },
    },
    matches: {
      errorMessage:
        "Password must have at least one uppercase, lowercase, digit and special character",
      options: new RegExp(
        "(^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#!@$%^&*()+=]).{8,20})",
        "g"
      ),
    },
  },
});

export const assertRequiredLoginFieldsIsNotEmpty = checkSchema({
  email: {
    exists: {
      errorMessage: "Email is required",
    },
  },
  password: {
    exists: {
      errorMessage: "Password is required",
    },
  },
});

type USER_KEYS = keyof UserDTO;

export const getUserFieldsByFieldToExtractBy = (
  code: USER_FIELDS_TO_EXTRACT | null
): USER_KEYS[] => {
  if (code === USER_FIELDS_TO_EXTRACT.CODE_1)
    return ["email", "name", "username", "createdAt", "role"];
  if (code === USER_FIELDS_TO_EXTRACT.CODE_2) return ["password", "email"];
  return ["email", "username"];
};
