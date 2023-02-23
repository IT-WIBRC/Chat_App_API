import {  Sequelize } from "sequelize-typescript";
import { Dialect } from "sequelize";
import configs from "../../config/env.config";

//Models
import { User, Conversation, Message, Member } from "../";

const { dbName, dbUser, dbHost, dbDriver, dbPassword } = configs;

const sequelizeConnection = new Sequelize({
  database: dbName as string,
  username: dbUser as string,
  password: dbPassword,
  host: dbHost,
  dialect: dbDriver as Dialect,
  logging: true,
  models: [User, Conversation, Message, Member]
})

export default sequelizeConnection