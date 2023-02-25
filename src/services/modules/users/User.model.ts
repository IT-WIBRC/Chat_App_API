import { Optional } from "sequelize";
import { Model, Table, Column, DataType, HasMany, Index } from "sequelize-typescript";
import { Conversation, ConversationDTO } from "../";

export enum ROLE {
    ADMIN = "ADMIN",
    MEMBER = "MEMBER",
    USER = "USER"
}

export interface UserDTO {
    userId: string;
    name: string;
    phoneNumber: number;
    username: string;
    password: string;
    role: ROLE;
    email: string;
    conversations: ConversationDTO[];
}

export type UserCreationDTO = Optional<UserDTO, "userId">;
@Table({
    charset: "utf-8",
    createdAt: true,
    updatedAt: true,
    tableName: "user"
})
export class User extends Model<UserDTO, UserCreationDTO> implements UserDTO {
    @Index
    @Column({
        type: DataType.UUID,
        allowNull: false,
        primaryKey: true
    })
    userId!: string;

    @Column({
        type: DataType.CHAR,
        allowNull: false,
    })
    name!: string;

    @Column({
        type: DataType.CHAR,
        unique: true,
        allowNull: false
    })
    username!: string;

    @Column({
        type: DataType.CHAR,
        unique: true,
        allowNull: false,
    })
    password!: string;

    @Column({
        type: DataType.ENUM(ROLE.ADMIN, ROLE.MEMBER, ROLE.USER),
        defaultValue: ROLE.MEMBER,
        allowNull: false,
    })
    role!: ROLE;

    @Column({
        type: DataType.CHAR,
        unique: true,
        allowNull: false,
        validate: {
            isEmail: true,
        }
    })
    email!: string;
    @Column({
        type: DataType.INTEGER,
        unique: true,
        allowNull: false,
        validate: {
            isNumeric: true,
            min: 9,
            max: 9
        }
    })
    phoneNumber!: number;

    @HasMany(() => Conversation)
    conversations!: Conversation[];
};