import { Dialect, Sequelize } from "sequelize";
import configs from "../env.config";

const { dbName, dbUser, dbHost, dbDriver, dbPassword } = configs;

const sequelizeConnection = new Sequelize(dbName as string, dbUser as string, dbPassword, {
  host: dbHost,
  dialect: dbDriver as Dialect
})

export default sequelizeConnection