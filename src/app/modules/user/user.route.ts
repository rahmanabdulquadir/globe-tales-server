import { Router } from "express";
import { upload } from "../../../utils/uploadFile";
import { authorizeRoles, isAuthenticatedUser } from "../../middlewares/auth";
import {
  getAllUser,
  updateUserInfo,
  updateUserProfileImage,
} from "./user.controller";

const router = Router();
router.get("/all", isAuthenticatedUser, authorizeRoles("admin"), getAllUser);
router.put("/update", isAuthenticatedUser, updateUserInfo);
router.put(
  "/update-profile-image",
  isAuthenticatedUser,
  upload.single("file"),
  updateUserProfileImage
);
const userRoute = router;
export default userRoute;