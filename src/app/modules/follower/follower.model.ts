import mongoose, { Types } from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    user: {
      type: Types.ObjectId,
      required: true,
      ref: "User",
    },
    follower: {
      type: Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Follower = mongoose.model("Follower", CommentSchema);

export default Follower;