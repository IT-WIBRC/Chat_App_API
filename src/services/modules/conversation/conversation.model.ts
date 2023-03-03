import {
  Model,
  Table,
  Column,
  DataType,
  HasMany,
  BelongsToMany,
  ForeignKey,
  Index,
} from "sequelize-typescript";
import { Member, Message, User } from "../";
import { ConversationDTO } from "../";
import { ConversationCreationDTO } from "../types/conversation";

@Table({
  charset: "utf-8",
  tableName: "conversation",
  timestamps: false,
  createdAt: true,
})
export class Conversation
  extends Model<ConversationDTO, ConversationCreationDTO>
  implements ConversationDTO
{
  @Index
  @Column({
    type: DataType.UUID,
    allowNull: false,
    primaryKey: true,
    unique: true,
  })
  declare conversationId: string;

  @Column({
    type: DataType.CHAR,
    unique: true,
  })
  declare name: string;

  @Column({
    type: DataType.TEXT,
  })
  declare description: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
  })
  declare userId: string;

  @HasMany(() => Message)
  declare messages: Message[];

  @BelongsToMany(() => User, () => Member)
  declare users: User[];
}
