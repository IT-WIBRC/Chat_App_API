import {  Sequelize } from "sequelize-typescript";
import { Dialect } from "sequelize";
import configs from "../../config/env.config";

//Models
import { User, Conversation, Message, Member, Image } from "../";

const { dbName, dbUser, dbHost, dbDialect, dbPassword, dbPort } = configs;

const sequelizeConnection = new Sequelize({
  database: dbName as string,
  username: dbUser as string,
  password: dbPassword,
  host: dbHost,
  dialect: dbDialect as Dialect,
  logging: console.log,
  port: Number(dbPort) || undefined,
  models: [Message, User, Conversation, Member, Image],
  pool: {
    acquire: 30000,
    idle: 10000
  }
})

export default sequelizeConnection