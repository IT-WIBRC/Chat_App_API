import dotenv from "dotenv";

dotenv.config({ path: __dirname + `/../../.env.${process.env.NODE_ENV}` });

const configs = {
  port: process.env.PORT,
  dbUrl: process.env.DB_URL,
  dbPassword: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,
  dbUser: process.env.DB_USER,
  dbHost: process.env.DB_HOST,
  dbDialect: process.env.DB_DIALECT,
  dbPort: process.env.DB_PORT,
  CORPS: process.env.CORPS,
  Encrypt_key: process.env.ENCRYPT_KEY,
  TOKEN_KEY: process.env.TOKEN_KEY,
  API_URL: process.env.API_URL,
  DOMAIN: process.env.DOMAIN,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
  ORGANIZATION_EMAIL: process.env.ORGANIZATION_EMAIL,
};

export default configs;
