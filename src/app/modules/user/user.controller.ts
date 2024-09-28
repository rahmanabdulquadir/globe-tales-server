/* eslint-disable @typescript-eslint/no-explicit-any */
import { JwtPayload } from "jsonwebtoken";
import { catchAsyncError } from "../../../utils/catchAsyncError";
import sendResponse from "../../../utils/sendResponse";
import { sendImageToCloudinary } from "../../../utils/uploadFile";
import QueryBuilder from "../../builder/QueryBuilder";
import User from "./user.model";

export const updateUserProfileImage = catchAsyncError(async (req, res) => {
  const file = req.file;
  const user = req.user as JwtPayload;
  if (!file) {
    return sendResponse(res, {
      message: "file not found",
      success: false,
      data: null,
      statusCode: 404,
    });
  }
  const uploadRes: any = await sendImageToCloudinary(file.filename, file.path);
  const url = uploadRes.secure_url as string;
  if (!url) {
    return sendResponse(res, {
      message: "failed to upload image",
      success: false,
      data: null,
      statusCode: 400,
    });
  }

  const isExistUser = await User.findOne({ email: user.email });
  if (!isExistUser) {
    return sendResponse(res, {
      message: "user not found",
      success: false,
      data: null,
      statusCode: 404,
    });
  }
  const result = await User.findByIdAndUpdate(
    isExistUser._id,
    { image: url },
    { new: true, runValidators: true }
  );

  sendResponse(res, {
    data: result,
    message: "image updated successfully",
    statusCode: 200,
    success: true,
  });
});
export const updateUserInfo = catchAsyncError(async (req, res) => {
  const { body } = req;
  const user = req.user as JwtPayload;
  ["email", "role", "image"].forEach((item) => delete body[item]);

  const isExistUser = await User.findOne({ email: user.email });
  if (!isExistUser) {
    return sendResponse(res, {
      message: "user not found",
      success: false,
      data: null,
      statusCode: 404,
    });
  }

  const result = await User.findByIdAndUpdate(isExistUser._id, body, {
    new: true,
    runValidators: true,
  });

  sendResponse(res, {
    data: result,
    message: "user profile updated successfully",
    statusCode: 200,
    success: true,
  });
});

export const getAllUser = catchAsyncError(async (req, res) => {
  const user = req.user as JwtPayload;

  const query = User.find({ _id: { $ne: user._id } }).populate({
    path: "auth",
    select: "role",
  });

  const build = new QueryBuilder(query, req.query).search([
    "firstName",
    "lastName",
    "email",
  ]);
  const totalDoc = await build.count();
  const result = await build.modelQuery;
  res.json({
    data: result,
    success: true,
    totalDoc: totalDoc.totalCount,
    message: "successfully get all user",
  });
});