import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", PostSchema);

export default Category;