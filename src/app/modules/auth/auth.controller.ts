/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";
import { catchAsyncError } from "../../../utils/catchAsyncError";
import { createAcessToken, createRefreshToken } from "../../../utils/jwtToken";
import sendMessage from "../../../utils/sendMessage";
import sendResponse from "../../../utils/sendResponse";

import Authentication from "./auth.model";
import User from "../user/user.model";

export const authSateController = catchAsyncError(async (req, res) => {
  const auth = req.user as JwtPayload;

  const data = await User.findOne({ email: auth.email });
  const result = data ? data.toObject() : {};
  res.json({
    success: true,
    message: "User state get",
    data: { ...result, role: auth.role },
  });
});
export const createUserController = catchAsyncError(async (req, res) => {
  const { body } = req;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const isExistCustomer = await Authentication.findOne({
      email: body.email,
    }).session(session);
    if (isExistCustomer) {
      await session.abortTransaction();
      session.endSession();
      return sendResponse(res, {
        success: false,
        data: null,
        message: "An account already exists with this email",
      });
    }

    const { email, password } = body;

    // Create authentication details
    const auth = await Authentication.create([{ email, password }], {
      session,
    });

    // Create the user document linked to the auth record
    const user = await User.create([{ ...body, auth: auth[0]._id }], {
      session,
    });

    // Generate tokens
    const token = createAcessToken(
      {
        email: auth[0].email,
        id: auth[0]._id.toString(),
        role: auth[0].role as string,
      },
      "1h"
    );

    const refreshToken = createRefreshToken({
      email: auth[0].email,
      id: auth[0]._id,
      role: auth[0].role,
    });

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    // Send response
    res.json({
      data: user[0],
      message: "User created successfully",
      success: true,
      accessToken: token,
      refreshToken,
    });
  } catch (error) {
    // Rollback transaction in case of error
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
});

export const genereteAccessToken = catchAsyncError(async (req, res) => {
  const getToken = req.header("Authorization");

  if (!getToken)
    return res.status(400).json({ msg: "Invalid Authentication." });

  const refreshToken = getToken.split(" ")[1];
  if (!refreshToken) {
    sendResponse(res, {
      message: "token must be provided",
      success: false,
      data: null,
      statusCode: 400,
    });
  }

  const refreshTokenSecret = process.env.JWT_REFRESH_SECRET as string;

  try {
    const decoded = jwt.verify(refreshToken, refreshTokenSecret);
    const user = (decoded as JwtPayload).user;
    const accessTOkenPayload = {
      email: user.email,
      id: user.id,
      role: user.role,
    };

    const isExistUser = await Authentication.findById(user.id);
    if (!isExistUser) {
      return sendResponse(res, {
        success: false,
        data: null,
        message: "User not found",
        statusCode: 404,
      });
    }

    const newAccessToken = createAcessToken(accessTOkenPayload, "1h");

    sendResponse(res, {
      success: true,
      message: "Successfully retrive access token",
      data: { accessToken: newAccessToken, user: isExistUser },
    });
  } catch (error) {
    console.error("Error decoding or verifying refresh token:", error);
    res.status(403).json({ message: "Invalid refresh token" });
  }
});

export const loginController = catchAsyncError(async (req, res) => {
  const { email, password } = req.body;
  const isExistUser = await Authentication.findOne({ email });
  if (!isExistUser) {
    return sendResponse(res, {
      success: false,
      data: null,
      message: "No account found on this email",
      statusCode: 404,
    });
  }
  const isPasswordMatched = await bcrypt.compare(
    password,
    isExistUser.password
  );
  if (!isPasswordMatched) {
    return sendResponse(res, {
      message: "password didn't matched",
      success: false,
      data: null,
      statusCode: 403,
    });
  }

  const token = createAcessToken(
    {
      email: isExistUser.email,
      id: isExistUser._id.toString() as string,
      role: isExistUser.role as string,
    },
    "1h"
  );

  const refreshToken = createRefreshToken({
    email: isExistUser.email,
    id: isExistUser._id,
    role: isExistUser.role,
  });

  const { password: pass, ...rest } = isExistUser?.toObject() || {};

  res.json({
    data: rest,
    message: "Login successfull",
    success: true,
    accessToken: token,
    refreshToken,
  });
});

export const changeRole = catchAsyncError(async (req, res) => {
  const id = req.params.id;
  const { role } = req.body;
  const isExistUser = await User.findById(id);
  if (!isExistUser) {
    return sendResponse(res, {
      success: false,
      data: null,
      message: "No account found",
      statusCode: 404,
    });
  }
  const result = await Authentication.findOneAndUpdate(
    { email: isExistUser.email },
    { role }
  );
  sendResponse(res, {
    data: result,
    success: true,
    message: "Successfully update role",
  });
});

// reset password
export const resetPassword = catchAsyncError(async (req, res) => {
  const { password, oldPassword } = req.body;

  const user = req.user;
  const email = user.email;

  if (!password || !oldPassword) {
    return res.json({
      message: "password, oldPassword => is required",
    });
  }

  const theUser = await Authentication.findOne({ email });
  // check if there no user
  if (!theUser) {
    return sendResponse(res, {
      message: "user not found",
      data: null,
      success: false,
      statusCode: 404,
    });
  }

  // varify old password
  const isOk = await bcrypt.compare(oldPassword, theUser.password as string);
  if (!isOk) {
    return sendResponse(res, {
      message: "password didn't matched",
      data: null,
      success: false,
      statusCode: 401,
    });
  }

  // create new hash password
  const newPass = await bcrypt.hash(password, 10);

  // update the new
  const updatePassword = await Authentication.findOneAndUpdate(
    { email },
    {
      $set: {
        password: newPass,
      },
    }
  );

  res.json({
    message: "password Updated",
    success: true,
    user: { ...updatePassword?.toObject(), password: "****" },
  });
});

// forgot-password controller
export const forgotPassword = catchAsyncError(async (req, res) => {
  const { email } = req.body;

  const user = await Authentication.findOne({ email });

  if (!user) {
    return res
      .status(404)
      .json({ success: false, message: "No user found with this email!" });
  }

  const tokenPayload = {
    email: user.email,
    _id: user._id,
  };

  const token = jwt.sign(
    tokenPayload,
    process.env.JWT_ACCESS_SECRET as string,
    {
      expiresIn: "5m",
    }
  );
  console.log(`${process.env.FRONTEND_BASE_URL}/recover-password/${token}`);

  sendMessage(
    "legendxpro123455@gmail.com",
    email,
    "Reset your password - Meme Canvas",

    `<div style="font-family: Arial, sans-serif; background-color: #f9f9f9; color: #333; margin: 0; padding: 0;">
      <div style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border: 1px solid #ddd;">
          <div style="text-align: center; background-color: #00466a; color: white; padding: 10px;">
              <h1 style="margin: 0;">Password Reset</h1>
          </div>
          <div style="padding: 20px;">
              <p>Hello,</p>
              <p>We received a request to reset your password. Click the button below to reset it.</p>
              <div style="text-align: center; margin: 20px 0;">
                  <a href="${process.env.FRONTEND_BASE_URL}/recover-password/${token}" style="display: inline-block; padding: 10px 20px; background-color: #00466a; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
              </div>
              <p>If you did not request a password reset, please ignore this email.</p>
              <p>Thanks,</p>
              <p>Memes canvas</p>
          </div>
          <div style="text-align: center; background-color: #f1f1f1; color: #555; padding: 10px;">
              <p style="margin: 0;">&copy; 2024 Fresh Blogs. All rights reserved.</p>
          </div>
      </div>
  </div>`
  );

  res.status(200).json({
    success: true,
    message: "Check your email to recover the password",
  });
});

// Resetting new password
export const recoverPassword = catchAsyncError(async (req, res) => {
  const { password } = req.body;
  const getToken = req.header("Authorization");

  if (!getToken) {
    return sendResponse(res, {
      message: "Token is not provided",
      data: null,
      success: false,
    });
  }
  const token = getToken.split(" ")[1];

  if (!token || !password) {
    return res.status(400).json({ error: "Token and password are required" });
  }

  let decoded;

  try {
    const decode: any = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET as string
    );

    decoded = decode;
  } catch {
    sendResponse(res, {
      data: null,
      message: "invalid authentication",
      statusCode: 401,
      success: false,
    });
    return;
  }

  if (!decoded)
    return res
      .status(401)
      .json({ success: false, message: "Invalid Authentication." });

  const user = await Authentication.findOne({
    email: decoded.email,
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      data: null,
      message: "User not found",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  user.password = hashedPassword;

  await Authentication.findByIdAndUpdate(user._id, {
    password: hashedPassword,
  });

  const tokenPayload = {
    email: user.email,
    id: user._id.toString(),
    role: user.role as string,
  };

  const accessToken = createAcessToken(tokenPayload, "1h");

  res.status(200).json({
    success: true,
    message: "Password has been successfully reset",
    accessToken,
  });
});