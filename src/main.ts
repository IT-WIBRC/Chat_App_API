import express, {
  NextFunction,
  Request,
  Response,
  type Application,
} from "express";
import { config } from "dotenv";

import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import cookieParser from "cookie-parser";
import RateLimit from "express-rate-limit";

import configs from "./config/env.config";

import { userRouter } from "./routes";

import { sequelizeConnection } from "./services/database/config";
import { xstAttackBlocker } from "./middlewares/requestMethod";

import { NotFound } from "./middlewares/errors/notFound";
import ErrorHandler from "./middlewares/errors/errorHandle";
import { transactionMiddleWare } from "./middlewares/transaction";

const { port, CLIENT_URL } = configs;

config();

export const app: Application = express();

app.use(
  helmet({
    xssFilter: true,
  })
);
app.use(
  RateLimit({
    windowMs: 60 * 60 * 1000,
    max: 2000000,
    message:
      "Too many requests maid from this IP, please try again after an hour",
  })
);
app.use(cookieParser());
app.use(
  cors({
    origin: CLIENT_URL,
  })
);

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use(transactionMiddleWare);
app.use("/api/v1/user", xstAttackBlocker, userRouter);

app.use((request: Request, response: Response, next: NextFunction) =>
  next(new NotFound(`Requested path ${request.path} not found`))
);

app.use(ErrorHandler.handle());

try {
  const isDev = process.env.NODE_ENV === "development";
  console.log(isDev);

  sequelizeConnection
    .sync({ alter: false }) //change it to { alter: false } before prod
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

process.on("uncaughtException", (err: Error) => {
  console.log(err.name, err.message);
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  process.exit(1);
});

process.on("unhandledRejection", (reason: Error) => {
  console.log(reason.name, reason.message);
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  process.exit(1);
});
