/* eslint-disable @typescript-eslint/ban-ts-comment */
import mongoose, { ObjectId } from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";
import { IAnyObject } from "../../interface/error";
import { IPost } from "./post.interface";
import Post from "./post.model";

const createPost = async (payload: IPost) => {
  const result = await Post.create(payload);
  return result;
};

const votePost = async (
  postId: string,
  userId: string,
  vote: "upvote" | "downvote"
) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new Error("Post not found");
  }

  const userObjectId = new mongoose.Types.ObjectId(
    userId
  ) as unknown as ObjectId;

  if (vote === "upvote") {
    // @ts-ignore
    const isAlreadyUpvoted = post.upvotes.includes(userObjectId);
    if (isAlreadyUpvoted) {
      post.upvotes.pull(userObjectId);
    } else {
      post.upvotes.addToSet(userObjectId);
      post.downvotes.pull(userObjectId);
    }
  } else {
    // @ts-ignore
    const isAlreadyDownvoted = post.downvotes.includes(userObjectId);
    if (isAlreadyDownvoted) {
      post.downvotes.pull(userObjectId);
    } else {
      post.downvotes.addToSet(userObjectId);
      post.upvotes.pull(userObjectId);
    }
  }

  // Update the upvoteCount and downvoteCount after updating the arrays
  post.upvoteCount = post.upvotes.length;
  post.downvoteCount = post.downvotes.length;

  // Save the post after updating counts
  await post.save();

  const result = await post.save();
  return result;
};

const getAllPosts = async (query: IAnyObject) => {
  let model = Post.find().populate("user").populate("categories");

  console.log(query.categories, true);
  if (query.categories) {
    const ids = query.categories
      .split(",")
      .map((id: string) => new mongoose.Types.ObjectId(id));
    model = model.find({ categories: { $in: ids } });
  }
  delete query.categories;

  const queryModel = new QueryBuilder(model, query)
    .fields()
    .paginate()
    .sort()
    .filter()
    .search(["title", "content"]);

  const totalDoc = await queryModel.count();
  const result = await queryModel.modelQuery;
  return { result, totalDoc: totalDoc.totalCount };
};

const postService = {
  createPost,
  getAllPosts,
  votePost,
};
export default postService;