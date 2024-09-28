import { Request, Response } from "express";

export const notFound = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: "route not not Found",
    origin: {
      path: req.originalUrl,
      method: req.method,
    },
  });
};