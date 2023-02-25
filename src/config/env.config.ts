import dotenv from "dotenv";

dotenv.config({ path: __dirname + `/../../.env.${process.env.NODE_ENV}` });

const configs= {
  port: process.env.PORT,
  dbUrl: process.env.DB_URL,
  dbPassword: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,
  dbUser: process.env.DB_USER,
  dbHost: process.env.DB_HOST,
  dbDialect: process.env.DB_DIALECT,
  dbPort: process.env.DB_PORT,
  CORPS: process.env.CORPS
};

export default configs;