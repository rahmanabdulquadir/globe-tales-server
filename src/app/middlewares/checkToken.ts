/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";

export const isValidToekn = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const getToken = req.header("Authorization");

    if (!getToken)
      return res.status(400).json({ msg: "Invalid Authentication." });

    const token = getToken.split(" ")[1];

    if (!token) {
      return res.status(204).json({
        success: false,
        message: "No token",
      });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string);

    if (!decoded)
      return res.status(400).json({ msg: "Invalid Authentication." });

    req.userInfo = decoded.user;

    next();
  } catch (err: any) {
    return res.status(500).json({ msg: err.message });
  }
};