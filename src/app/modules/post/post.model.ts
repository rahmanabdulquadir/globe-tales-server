import mongoose, { Types } from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
    },
    categories: {
      type: [Types.ObjectId],
      required: true,
      ref: "Category",
    },
    upvotes: {
      type: [Types.ObjectId],
      ref: "User",
    },
    downvotes: {
      type: [Types.ObjectId],
      ref: "User",
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", PostSchema);

export default Post;