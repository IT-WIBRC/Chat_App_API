import { Sequelize } from "sequelize";
import {
  Model,
  Table,
  Column,
  DataType,
  HasMany,
  Index,
  BeforeCreate,
  BeforeUpdate,
} from "sequelize-typescript";
import { Conversation } from "../";
import { hashPassword } from "../../utils/auth.utils";
import { UserCreationDTO, UserDTO } from "../types/user";

@Table({
  charset: "utf-8",
  createdAt: true,
  updatedAt: true,
  tableName: "user",
})
export class User extends Model<UserDTO, UserCreationDTO> implements UserDTO {
  @Index
  @Column({
    type: DataType.UUID,
    allowNull: false,
    primaryKey: true,
    unique: true,
    defaultValue: Sequelize.literal("uuid_generate_v4()"),
  })
  declare userId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  declare username: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  declare password: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  })
  declare email: string;

  @HasMany(() => Conversation)
  declare conversations: Conversation[];

  @BeforeCreate
  static async hasPasswordAtCreation(instance: User) {
    instance.password = await hashPassword(instance.password);
  }

  @BeforeUpdate
  static async hasPasswordAtUpdate(instance: User) {
    instance.password = await hashPassword(instance.password);
  }
}
