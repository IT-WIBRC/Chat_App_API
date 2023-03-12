import { Sequelize } from "sequelize-typescript";
import { Dialect } from "sequelize";
import configs from "../../config/env.config";
import { createNamespace } from "cls-hooked";

//Models
import { User, Conversation, Message, Member, Image, Token } from "../";

const { dbName, dbUser, dbHost, dbDialect, dbPassword, dbPort } = configs;

const dbNamespace = createNamespace("db");
const sequelizeConnection = new Sequelize({
  database: dbName as string,
  username: dbUser as string,
  password: dbPassword,
  host: dbHost,
  dialect: dbDialect as Dialect,
  logging: console.log,
  port: Number(dbPort) || undefined,
  models: [Message, User, Conversation, Member, Image, Token],
  pool: {
    acquire: 30000,
    idle: 10000,
  },
});

sequelizeConnection.Sequelize.useCLS(dbNamespace);

export { sequelizeConnection, dbNamespace };
