import { Token, TokenDTO } from "./token.model";

export class TokenService {
  static async findByUserId(userId: string): Promise<Token | null> {
    return await Token.findOne({
      where: { userId },
    });
  }

  static async create(token: TokenDTO): Promise<Token | null> {
    return await Token.create(token);
  }
}
