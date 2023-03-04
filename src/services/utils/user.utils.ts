import { UserDTO, USER_FIELDS_TO_EXTRACT } from "../modules/types/user";

type USER_KEYS = keyof UserDTO;

export const getUserFieldsByFieldToExtractBy = (
  code: USER_FIELDS_TO_EXTRACT | null
): USER_KEYS[] => {
  if (code === USER_FIELDS_TO_EXTRACT.CODE_1)
    return ["email", "name", "username", "createdAt"];
  if (code === USER_FIELDS_TO_EXTRACT.CODE_2)
    return ["password", "email", "username", "name", "userId"];
  if (code === USER_FIELDS_TO_EXTRACT.CODE_3)
    return ["email", "username", "name", "userId", "createdAt", "userId"];
  return ["email", "username", "userId"];
};
