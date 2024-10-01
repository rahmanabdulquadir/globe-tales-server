import { Router } from "express";
import { isAuthenticatedUser } from "../../middlewares/auth";
import { validSchema } from "../../middlewares/validator";
import { postController } from "./post.controller";
import { postValidationSchema } from "./post.validation";
import { multerUpload } from "../../config/cloudinaryMulter";
const router = Router();
router.post(
  "/create",
  isAuthenticatedUser,
  validSchema(postValidationSchema),
  postController.createPost
);

router.delete(
  "/delete/:postId",
  isAuthenticatedUser,
  postController.deletePost
);
router.post(
  "/upload-image",
  isAuthenticatedUser,
  multerUpload.single("file"),
  postController.uploadPostImage
);
router.get("/get", postController.getAllPosts);
router.patch("/vote/:postId", isAuthenticatedUser, postController.votePost);
const postRoute = router;

export default postRoute;