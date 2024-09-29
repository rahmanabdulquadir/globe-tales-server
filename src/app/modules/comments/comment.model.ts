import mongoose, { Types } from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    user: {
      type: Types.ObjectId,
      required: true,
      ref: "User",
    },

    comment: {
      type: String,
      required: true,
    },
    post: {
      type: Types.ObjectId,
      required: true,
      ref: "Post",
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", CommentSchema);

export default Comment;