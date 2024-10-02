import { JwtPayload } from "jsonwebtoken";
import { catchAsyncError } from "../../../utils/catchAsyncError";
import sendResponse from "../../../utils/sendResponse";
import QueryBuilder from "../../builder/QueryBuilder";
import { IPaymentPayload } from "../payment/payment.interface";
import { initiatePayment } from "../payment/payment.utils";
import Post from "../post/post.model";
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
  const url = file.path as string;
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

  const build = new QueryBuilder(query, req.query)
    .search(["firstName", "lastName", "email"])
    .paginate();
  const totalDoc = await build.count();
  const result = await build.modelQuery;
  res.json({
    data: result,
    success: true,
    totalDoc: totalDoc.totalCount,
    message: "successfully get all user",
  });
});

export const isCapableForPremium = catchAsyncError(async (req, res) => {
  const user = req.user._id;

  const post = await Post.findOne({ user: user, upvoteCount: { $gt: 0 } });

  sendResponse(res, {
    data: post ? true : false,
    success: true,
    message: "successfully check user capability for premium",
  });
});

export const generateVerifyAccountPaymentUrl = catchAsyncError(
  async (req, res) => {
    const user = req.user as JwtPayload;
    const post = await Post.findOne({ user: user, upvoteCount: { $gt: 0 } });
    if (!post) {
      return sendResponse(res, {
        message: "Not capled for premium",
        success: false,
        data: null,
        statusCode: 404,
      });
    }

    const payload: IPaymentPayload = {
      amount: 200,
      cus_add: "N/A",
      cus_name: user.firstName + " " + user.lastName,
      cus_phone: "N/A",
      cus_email: user.email,
      tran_id: String(Date.now()),
    };

    const result = await initiatePayment(payload, user._id);

    sendResponse(res, {
      data: result,
      success: true,
      message: "successfully get payment url",
    });
  }
);