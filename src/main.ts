import express, { Application } from "express";
import { config } from "dotenv";
import cors from "cors";
import configs from "./config/env.config";

import { userRouter } from "./routes";

import sequelizeConnection from "./services/database/config";

const { port, CORPS } = configs;

config();

const app: Application = express();

app.use(cors({
    origin: CORPS
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    (
      err: Error,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      res.status(500).json({ message: err.message });
    }
  );

  //routes
  app.use("/api/v1/user", userRouter);

try {
    const isDev = process.env.NODE_ENV === "development" ? true : false;
    console.log(isDev);

    sequelizeConnection.sync({ alter: false }).then(() => {
      console.log("Connextion succeed");
    }).catch((err) => {
      console.log("Connexion failed", err.message);
    })
    app.listen(port, () => 
    console.log(process.env.API_URL || "http://localhost:8080"));   
} catch (error: unknown) {
    console.log("Server has not started due to : ", error);
    
}