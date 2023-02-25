import { Blob } from "buffer";
import { Optional } from "sequelize";
import { Model, Table, Column, DataType, BelongsTo, ForeignKey, PrimaryKey, Index } from "sequelize-typescript";
import { Conversation } from "../";

export interface MessageDTO {
    messageId: string;
    text?: string;
    link?: string;
    image?: Blob;
}
export type MessageCreationDTO = Optional<MessageDTO, "messageId">;

@Table({
    charset: "utf-8",
    tableName: "message",
    createdAt: true,
    updatedAt: true,
})
export class Message extends Model<MessageCreationDTO, MessageDTO> implements MessageDTO {
    @Index
    @Column({
        type: DataType.UUID,
        primaryKey: true,
        allowNull: false,
    })
    messageId!: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    text?: string;

    @Column({
        type: DataType.CHAR,
        allowNull: true,
    })
    link?: string;

    @Column({
        type: DataType.BLOB,
        allowNull: true,
    })
    image?: Blob;

    @ForeignKey(() => Conversation)
    @Column({
        type: DataType.UUID,
    })
    conversationId!: string;

    @BelongsTo(() => Conversation)
    conversation!: Conversation;
}