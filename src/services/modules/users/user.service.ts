import { User } from "../";

export default class UserService {

    async findAll(): Promise<User[]> {
      return await User.findAll<User>();
    }
}