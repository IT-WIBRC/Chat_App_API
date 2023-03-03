import { Model, Table, Column, DataType, BelongsTo, ForeignKey, PrimaryKey, Index, HasOne } from "sequelize-typescript";
import { Conversation } from "../";
import { Image } from "../image/image.model";
import { MessageCreationDTO, MessageDTO } from "../types/message";

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
    declare messageId: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    declare text: string;

    @Column({
        type: DataType.CHAR,
        allowNull: true,
    })
    declare link: string;

    @HasOne(() => Image)
    declare image: Image;

    @ForeignKey(() => Conversation)
    @Column({
        type: DataType.UUID,
    })
    declare conversationId: string;

    @BelongsTo(() => Conversation)
    declare conversation: Conversation;
}