import { Optional } from "sequelize";
import { Model, Table, Column, DataType } from "sequelize-typescript";

@Table({
    charset: "utf-8",
    tableName: "message",
    createdAt: true,
    updatedAt: true,
})
export class Message extends Model {}