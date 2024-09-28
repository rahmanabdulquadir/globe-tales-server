import express, { Request, Response } from "express";
import cors from "cors";
import router from "./app/routes";
import { notFound } from "./app/middlewares/not-found";
import globalErrorHandler from "./app/middlewares/error";

// express
const app = express();

// parsers
app.use(express.json());
app.use(cors());

// application routes
app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello From Globe Tales!");
});

// 404 Handler
app.use(notFound);

app.use(globalErrorHandler);

export default app;
