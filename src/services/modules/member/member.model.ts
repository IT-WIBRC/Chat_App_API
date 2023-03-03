import { Model, Table, Column, DataType, ForeignKey, PrimaryKey, CreatedAt, DeletedAt, Index } from "sequelize-typescript";
import { Conversation, User } from "../";
import { MemberCreationDTO, MemberDTO } from "../types/member";

@Table({
    charset: "utf-8",
    tableName: "member",
    updatedAt: false,
})
export class Member extends Model<MemberCreationDTO, MemberDTO> implements MemberDTO {
    @Index
    @Column({
        type: DataType.UUID,
        primaryKey: true,
        allowNull: false,
        unique: true,
    })
    declare memberId: string;

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID
    })
    declare userId: string;

    @ForeignKey(() => Conversation)
    @Column({
        type: DataType.UUID,
    })
    declare conversationId: string;

    @Column({
        type: DataType.DATE,
    })
    @CreatedAt
    declare join_at: Date;

    @Column({
        type: DataType.DATE,
    })
    @DeletedAt
    declare leave_at: Date;
}