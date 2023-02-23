import { Optional } from "sequelize";
import { Model, Table, Column, DataType } from "sequelize-typescript";

export enum ROLE {
    ADMIN = "ADMIN",
    MEMBER = "MEMBER",
    USER = "USER"
}

export interface UserAttributes {
    id: string;
    name: string;
    phoneNumber: number;
    username: string;
    password: string;
    role: ROLE;
    email: string;
}

export type UserCreationAttributes = Optional<UserAttributes, "id">;
@Table({
    charset: "utf-8",
    createdAt: true,
    updatedAt: true,
    tableName: "user"
})
export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    @Column({
        type: DataType.UUIDV4,
        allowNull: false,
        primaryKey: true
    })
    id!: string;

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
        type: DataType.NUMBER,
        unique: true,
        allowNull: false,
        validate: {
            isNumeric: true,
            min: 9,
            max: 9
        }
    })
    phoneNumber!: number;
};