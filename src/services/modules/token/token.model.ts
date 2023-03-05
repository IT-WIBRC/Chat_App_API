import {
  Model,
  Table,
  Column,
  DataType,
  Index,
  BeforeCreate,
  BeforeUpdate,
} from "sequelize-typescript";
import { hashPassword } from "../../utils/auth.utils";

export interface TokenDTO {
  userId: string;
  token: string;
  createAt?: string;
}

@Table({
  charset: "utf-8",
  tableName: "token",
  updatedAt: false,
  createdAt: true,
})
export class Token extends Model<TokenDTO> implements TokenDTO {
  @Index
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    unique: true,
  })
  declare userId: string;

  @Column({
    type: DataType.STRING,
  })
  declare token: string;

  @BeforeCreate
  static async hasTokenBeforeCreation(instance: Token) {
    instance.token = await hashPassword(instance.token);
  }

  @BeforeUpdate
  static async hasTokenBeforeUpdate(instance: Token) {
    instance.token = await hashPassword(instance.token);
  }
}
