import express, { Application } from "express";
import { config } from "dotenv";
import cors from "cors";
import configs from "./config/env.config";

const { port } = configs;

config();

const app: Application = express();

app.use(cors({
    origin: ""
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


try {
    app.listen(port, () => 
    console.log(process.env.API_URL || "http://localhost:8080"));   
} catch (error: unknown) {
    console.log("Server has not started due to : ", error);
    
}