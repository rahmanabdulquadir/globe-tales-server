/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import AppError from "../errors/AppError";
import Authentication from "../modules/auth/auth.model";
import User from "../modules/user/user.model";

export const isAuthenticatedUser = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const getToken = req.header("Authorization");

    if (!getToken)
      return res.status(401).json({ message: "Invalid Authentication." });

    const token = getToken.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token not provided" });
    }
    const decoded: any = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET as string
    );
    // console.log("desss", decoded);

    if (!decoded)
      return res.status(401).json({ message: "Invalid Authentication." });

    const user = await User.findOne({
      auth: decoded?.user?.id,
    });
    if (!user) return res.status(404).json({ message: "User does not exist." });
    const auth = await Authentication.findOne({ email: user.email });
    if (!auth) return res.status(404).json({ message: "User does not exist." });

    // console.log("user =======", user);

    const payload = user.toObject();
    req.user = { ...payload, role: auth.role };

    next();
  } catch (err: any) {
    return res.status(401).json({ message: err.message });
  }
};

export const isAuthenticatedUserOptional = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const getToken = req.header("Authorization");
    if (!getToken) {
      return next();
    }

    const token = getToken.split(" ")[1];

    if (!token || token === "undifined") {
      return next();
    }

    const decoded: any = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET as string
    );

    if (!decoded)
      return res.status(401).json({ message: "Invalid Authentication." });

    const user = await User.findOne({
      auth: decoded?.user?.id,
    });

    if (!user) return next();

    const auth = await Authentication.findOne({ email: user.email });

    if (!auth) return next();

    const payload = user.toObject();
    req.user = { ...payload, role: auth.role };

    next();
  } catch (err: any) {
    // If there's an error (like token verification fails), return 401
    return res.status(401).json({ message: err.message });
  }
};

export const authorizeRoles = (...roles: any) => {
  return (req: any, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role)) {
      return next(
        new AppError(
          403,
          `User type: ${req.user?.role} is not allowed to access this resouce `
        )
      );
    }
    next();
  };
};