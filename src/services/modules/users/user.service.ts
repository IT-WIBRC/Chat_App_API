import { User } from "../";
import {
  UserCreationDTO,
  UserDTO,
  USER_FIELDS_TO_EXTRACT,
} from "../types/user";
import { getUserFieldsByFieldToExtractBy } from "../../utils/user.utils";

export default class UserService {
  static async findAll(): Promise<User[]> {
    return await User.findAll<User>({
      attributes: getUserFieldsByFieldToExtractBy(
        USER_FIELDS_TO_EXTRACT.CODE_1
      ),
    });
  }

  static async create(user: UserCreationDTO): Promise<UserDTO> {
    return await User.create<User>(user);
  }

  static async findByEmail(
    email: string,
    code: USER_FIELDS_TO_EXTRACT
  ): Promise<User | null> {
    return await User.findOne({
      attributes: getUserFieldsByFieldToExtractBy(code),
      where: { email },
    });
  }

  static async findByUserName(
    username: string,
    code: USER_FIELDS_TO_EXTRACT
  ): Promise<User | null> {
    return await User.findOne({
      attributes: getUserFieldsByFieldToExtractBy(code),
      where: { username },
    });
  }

  static async findById(
    id: string,
    code: USER_FIELDS_TO_EXTRACT
  ): Promise<User | null> {
    return await User.findByPk(id, {
      attributes: getUserFieldsByFieldToExtractBy(code),
    });
  }

  static async update(
    id: string,
    user: Partial<UserDTO>
  ): Promise<User | null> {
    const userToUpdate = await User.findByPk(id);

    if (userToUpdate) {
      return await userToUpdate.update(user);
    }
    return null;
  }
}
