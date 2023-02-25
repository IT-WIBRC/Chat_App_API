import { Optional } from "sequelize";
import { Model, Table, Column, DataType, ForeignKey, PrimaryKey, CreatedAt, DeletedAt, Index } from "sequelize-typescript";
import { Conversation, User } from "../";

export interface MemberDTO {
    memberId: string;
    userId: string;
    conversationId: string;
    join_at: Date;
    leave_at: Date;
}
export type MemberCreationDTO = Optional<MemberDTO, "memberId">;
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
    memberId!: string;

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID
    })
    userId!: string;

    @ForeignKey(() => Conversation)
    @Column({
        type: DataType.UUID,
    })
    conversationId!: string;

    @Column({
        type: DataType.DATE,
    })
    @CreatedAt
    join_at!: Date;

    @Column({
        type: DataType.DATE,
    })
    @DeletedAt
    leave_at!: Date;
}