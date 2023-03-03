import { Sequelize } from "sequelize";
import {
  Model,
  Table,
  Column,
  DataType,
  HasMany,
  Index,
} from "sequelize-typescript";
import { Conversation } from "../";
import { UserCreationDTO, UserDTO, ROLE } from "../types/user";

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
    type: DataType.CHAR,
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.CHAR,
    unique: true,
    allowNull: false,
  })
  declare username: string;

  @Column({
    type: DataType.CHAR,
    unique: true,
    allowNull: false,
  })
  declare password: string;

  @Column({
    type: DataType.ENUM(ROLE.ADMIN, ROLE.MEMBER, ROLE.USER),
    allowNull: true,
  })
  declare role: ROLE;

  @Column({
    type: DataType.CHAR,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  })
  declare email: string;

  @HasMany(() => Conversation)
  declare conversations: Conversation[];
}
