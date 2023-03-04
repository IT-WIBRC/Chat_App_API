import express, { type Application } from "express";
import { config } from "dotenv";

import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import cookieParser from "cookie-parser";

import configs from "./config/env.config";

import { userRouter } from "./routes";

import sequelizeConnection from "./services/database/config";
import { xstAttackBlocker } from "./middlewares/requestMethod";

const { port, CORPS } = configs;

config();

const app: Application = express();

app.use(helmet());
app.use(cookieParser());
app.use(
  cors({
    origin: CORPS,
  })
);

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api/v1/user", xstAttackBlocker, userRouter);

try {
  const isDev = process.env.NODE_ENV === "development";
  console.log(isDev);

  sequelizeConnection
    .sync({ alter: false }) //change it to alter before prod
    .then(() => {
      console.log("Connextion succeed");
    })
    .catch((err) => {
      console.log("Connexion failed", err.message);
    });
  app.listen(port, () => {
    console.log(process.env.API_URL || "http://localhost:8080");
  });
} catch (error: unknown) {
  console.log("Server has not started due to : ", error);
}
