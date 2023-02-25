import { Optional } from "sequelize";
import { Model, Table, Column, DataType, HasMany, BelongsToMany, ForeignKey, PrimaryKey, Index } from "sequelize-typescript";
import { Member, Message, User, UserDTO } from "../";

export interface ConversationDTO {
    conversationId: string;
    name: string;
    description?: string;
    users: UserDTO[];
}
export type ConversationCreationDTO = Optional<ConversationDTO, "conversationId">
@Table({
    charset: "utf-8",
    tableName: "conversation",
    timestamps: false,
})
export class Conversation extends Model<ConversationDTO, ConversationCreationDTO> implements ConversationDTO{

    @Index
    @Column({
        type: DataType.UUID,
        allowNull: false,
        primaryKey: true,
        unique: true,
    })
    conversationId!: string;

    @Column({
        type: DataType.CHAR,
        unique: true,
    })
    name!: string;

    @Column({
        type: DataType.TEXT,
    })
    description?: string;

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
    })
    userId!: string;

    @HasMany(() => Message)
    messages!: Message[];

    @BelongsToMany(() => User, () => Member)
    users!: User[];
}