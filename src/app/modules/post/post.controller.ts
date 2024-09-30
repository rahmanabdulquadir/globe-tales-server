import { JwtPayload } from "jsonwebtoken";
import { catchAsyncError } from "../../../utils/catchAsyncError";
import sendResponse from "../../../utils/sendResponse";
import { IPost } from "./post.interface";
import postService from "./post.service";

export const uploadPostImage = catchAsyncError(async (req, res) => {
  const file = req.file;
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

  sendResponse(res, {
    message: "image uploaded successfully",
    success: true,
    data: url,
    statusCode: 200,
  });
});

const createPost = catchAsyncError(async (req, res) => {
  const { title, content, categories, isPremium, images } = req.body;
  const user = req.user._id;
  const payload = {
    title,
    content,
    images,
    categories,
    isPremium: isPremium || false,
    user: user as string,
  } as IPost;
  const result = await postService.createPost(payload);

  sendResponse(res, {
    message: "post created successfully",
    success: true,
    data: result,
    statusCode: 200,
  });
});

const deletePost = catchAsyncError(async (req, res) => {
  const { postId } = req.params;
  const user = req.user as JwtPayload;
  const result = await postService.deletePost(postId, user._id);
  sendResponse(res, {
    message: "post deleted successfully",
    success: true,
    data: result,
    statusCode: 200,
  });
})

const getAllPosts = catchAsyncError(async (req, res) => {
  const query = req.query;
  const { result, totalDoc } = await postService.getAllPosts(query);

  sendResponse(res, {
    success: false,
    statusCode: 200,
    message: "No Data Found",
    data: result,
    totalDoc,
  });
});

const votePost = catchAsyncError(async (req, res) => {
  const { postId } = req.params;
  const { vote } = req.query;
  const userId = (req.user as JwtPayload)._id;

  const voteType = ["upvote", "downvote"];

  if (!postId || !vote || !voteType.includes(vote as string)) {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: "Invalid request",
      data: null,
    });
  }

  const result = await postService.votePost(
    postId,
    userId,
    vote as "upvote" | "downvote"
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "post voted successfully",
    data: result,
  });
});

export const postController = {
  createPost,
  uploadPostImage,deletePost,
  getAllPosts,
  votePost,
};