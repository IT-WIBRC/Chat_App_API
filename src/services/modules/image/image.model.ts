import { BelongsTo, Column, DataType, ForeignKey, Index, IsUrl, Model, Table } from "sequelize-typescript";
import { Message } from "..";
import { ImageCreation, ImageDTO } from "../types/image";


@Table({
    charset: "utf-8",
    tableName: "Image",
    createdAt: true,
    updatedAt: false,
})
export class Image extends Model<ImageCreation, ImageCreation> implements ImageDTO {
    @Column({
        type: DataType.UUID,
        primaryKey: true,
        unique: true,
    })
    declare imageId: string;

    @Column({
        type: DataType.CHAR,
    })
    declare title: string;

    @IsUrl
    @Index
    @Column({
        type: DataType.TEXT,
    })
    declare src: string;

    @Column({
        type: DataType.CHAR,
    })
    declare description: string;
    
    @ForeignKey(() => Message)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    declare messageId: string;

    @BelongsTo(() => Message)
    declare message: Message;
}