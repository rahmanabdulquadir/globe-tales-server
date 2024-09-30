import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { IAnyObject } from "../../interface/error";
import Post from "../post/post.model";
import { IComment } from "./comment.interface";
import Comment from "./comment.model";

const createComment = async (comment: IComment) => {
  const isPostExists = await Post.findById(comment.post);
  if (!isPostExists) {
    throw new AppError(404, "Post not found");
  }
  const result = await Comment.create(comment);
  isPostExists.commentCount = isPostExists.commentCount + 1;
  await isPostExists.save();
  return result;
};
const getCommentsByPostId = async (postId: string, query: IAnyObject) => {
  const isPostExists = await Post.findById(postId);
  if (!isPostExists) {
    throw new AppError(404, "Post not found");
  }

  const model = Comment.find({ post: isPostExists._id })
    .populate("user")
    .sort("-createdAt");

  const queryBuilder = new QueryBuilder(model, query).paginate();

  const totalDoc = await queryBuilder.count();
  const result = await queryBuilder.modelQuery;

  return { result, totalDoc: totalDoc.totalCount };
};

const updateComment = async (
  id: string,
  userId: string,
  newComment: string
) => {
  const comment = await Comment.findById(id);
  if (!comment) {
    throw new Error("Comment not found");
  }

  if (comment.user.toString() !== userId.toString()) {
    throw new Error("Unauthorized access");
  }

  const isPostExists = await Post.findById(comment.post);
  if (!isPostExists) {
    throw new Error("Post not found");
  }

  const result = await Comment.findByIdAndUpdate(
    id,
    {
      comment: newComment,
    },
    {
      new: true,
    }
  );

  return result;
};

const deleteComment = async (id: string, userId: string) => {
  const comment = await Comment.findById(id);
  if (!comment) {
    throw new AppError(404, "Comment not found");
  }

  if (comment.user.toString() !== userId.toString()) {
    throw new AppError(403, "Unauthorized access");
  }

  const isPostExists = await Post.findById(comment.post);
  if (!isPostExists) {
    throw new AppError(404, "Post not found");
  }

  const result = await Comment.findByIdAndDelete(id);
  isPostExists.commentCount = isPostExists.commentCount - 1;
  await isPostExists.save();
  return result;
};

export const commentService = {
  createComment,
  getCommentsByPostId,
  updateComment,
  deleteComment,
};
