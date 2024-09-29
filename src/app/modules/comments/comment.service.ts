import Post from "../post/post.model";
import { IComment } from "./comment.interface";
import Comment from "./comment.model";


const createComment = async (comment: IComment) => {
  const result = await Comment.create(comment);
  return result;
};
const getCommentsByPostId = async (postId: string) => {
  const isPostExists = await Post.findById(postId);
  if (!isPostExists) {
    throw new Error("Post not found");
  }

  const result = await Comment.find({ post: isPostExists._id });
  return result;
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

  if (comment.user.toString() !== userId) {
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
    throw new Error("Comment not found");
  }

  if (comment.user.toString() !== userId) {
    throw new Error("Unauthorized access");
  }

  const isPostExists = await Post.findById(comment.post);
  if (!isPostExists) {
    throw new Error("Post not found");
  }

  const result = await Comment.findByIdAndDelete(id);

  return result;
};

export const commentService = {
  createComment,
  getCommentsByPostId,
  updateComment,
  deleteComment,
};