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

export const assertRequiredRegisterFieldsAreNotEmpty = checkSchema({
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
      errorMessage: "Name must have length less than 9",
      options: { max: 8 },
    },
  },
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

export const assertRequiredUpdateFieldsAreNotEmpty = checkSchema({
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
      errorMessage: "Name must have length less than 9",
      options: { max: 8 },
    },
  },
});

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

export const generateToken = (payload: PayloadSession): string => {
  return sign(payload, TOKEN_KEY as string, {
    algorithm: "HS512",
    expiresIn: "30 days",
  });
};

export const checkToken = (token: string): PayloadSession | null | string => {
  let parsedToken: PayloadSession | null = null;
  let errorTokenMessage = "";
  console.log(token);
  verify(token, TOKEN_KEY as string, (err, parsed): void => {
    if (err) {
      switch (err.name) {
        case "TokenExpiredError":
          errorTokenMessage = "Token has expired";
          break;
        case "JsonWebTokenError":
          errorTokenMessage = "Invalid token";
          break;
        case "NotBeforeError":
          errorTokenMessage = "Token is not active";
          break;
        default:
          errorTokenMessage = "Other Error";
          break;
      }
    } else parsedToken = parsed as PayloadSession;
  });
  return errorTokenMessage ? errorTokenMessage : parsedToken;
};
