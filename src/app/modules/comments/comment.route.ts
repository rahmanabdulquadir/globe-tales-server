import { Router } from "express";
import { isAuthenticatedUser } from "../../middlewares/auth";
import { commentController } from "./comment.controller";
const router = Router();

router.post(
  "/create/:id",
  isAuthenticatedUser,
  commentController.createComment
);
router.get("/get/:id", commentController.getCommentsByPostId);
router.put("/update/:id", isAuthenticatedUser, commentController.updateComment);
router.delete(
  "/delete/:id",
  isAuthenticatedUser,
  commentController.deleteComment
);
const commentRoute = router;
export default commentRoute;