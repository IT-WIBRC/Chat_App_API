import { hash, compare } from "bcrypt";
import { checkSchema } from "express-validator";
import { sign, verify } from "jsonwebtoken";
import configs from "../../config/env.config";
import { User } from "../modules";
import { PayloadSession } from "../modules/types/user";

const SALBOUND = 10;
const { Encrypt_key, TOKEN_KEY } = configs;

export const hashPassword = async (password: string): Promise<string> =>
  await hash(password, SALBOUND);

export const comparePassword = async (
  plainTextpassword: string,
  passwordHashed: string
): Promise<boolean> => await compare(plainTextpassword, passwordHashed);

export const emailValidation = checkSchema({
  email: {
    exists: {
      errorMessage: "Email is required",
    },
    isEmail: {
      bail: true,
      errorMessage: "Email is in wrong format",
      options: {
        allow_ip_domain: false,
        allow_utf8_local_part: true,
      },
    },
    normalizeEmail: {
      options: {
        gmail_convert_googlemaildotcom: false,
        gmail_remove_dots: false,
        gmail_remove_subaddress: false,
        yahoo_remove_subaddress: false,
        icloud_remove_subaddress: false,
        outlookdotcom_remove_subaddress: false,
      },
    },
  },
});

export const passwordValidation = checkSchema({
  password: {
    exists: {
      errorMessage: "Password is required",
    },
    trim: true,
    isLength: {
      errorMessage: "Password must have at least 8 character",
      options: {
        min: 8,
        max: 20,
      },
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

export const nameValidation = checkSchema({
  name: {
    exists: {
      errorMessage: "name is required",
    },
    trim: true,
    isLength: {
      errorMessage: "Name must have length less than 9",
      options: { max: 8 },
    },
  },
});
export const usernameValidation = checkSchema({
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
});

export const assertRequiredLoginFieldsAreNotEmpty = checkSchema({
  email: {
    exists: {
      errorMessage: "Email is required",
    },
    trim: true,
  },
  password: {
    exists: {
      errorMessage: "Password is required",
    },
    trim: true,
  },
});

export const parsedCookie = (cookie: string): PayloadSession | boolean => {
  const cookieInfo = checkToken(JSON.parse(cookie));

  if (cookieInfo) {
    return cookieInfo as PayloadSession;
  }
  return false;
};

export const createCookie = (user: User): PayloadSession => {
  return {
    id: user.getDataValue("userId"),
    profile: {
      email: user.getDataValue("email"),
      username: user.getDataValue("username"),
      name: user.getDataValue("name"),
    },
    key: Encrypt_key as string,
  };
};

export const generateToken = (
  payload: PayloadSession | object,
  key = TOKEN_KEY as string,
  time = "30 days"
): string => {
  return sign(payload, key, {
    algorithm: "HS512",
    expiresIn: time,
  });
};

export type EXP_TOKEN = {
  token: string;
};
export const checkToken = (
  token: string,
  key = TOKEN_KEY
): PayloadSession | null | string | EXP_TOKEN => {
  let parsedToken: PayloadSession | null | string | EXP_TOKEN = null;
  let errorTokenMessage: TOKEN_ERROR = "" as TOKEN_ERROR;
  verify(token, key as string, (err, parsed): void => {
    if (err) {
      switch (err.name) {
        case "TokenExpiredError":
          errorTokenMessage = TOKEN_ERROR.EXPIRED;
          break;
        case "JsonWebTokenError":
          errorTokenMessage = TOKEN_ERROR.INVALID;
          break;
        case "NotBeforeError":
          errorTokenMessage = TOKEN_ERROR.ACTIVE;
          break;
        default:
          errorTokenMessage = TOKEN_ERROR.OTHER;
          break;
      }
    } else parsedToken = parsed as PayloadSession | string | null | EXP_TOKEN;
  });
  return errorTokenMessage ? errorTokenMessage : parsedToken;
};

export enum TOKEN_ERROR {
  EXPIRED = "Token has expired",
  INVALID = "Invalid token",
  ACTIVE = "Token not active",
  OTHER = "Other errors",
}
