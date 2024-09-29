import { Router } from "express";

import { authorizeRoles, isAuthenticatedUser } from "../../middlewares/auth";
import {
  getAllUser,
  updateUserInfo,
  updateUserProfileImage,
} from "./user.controller";
import { multerUpload } from "../../config/cloudinaryMulter";

const router = Router();
router.get("/all", isAuthenticatedUser, authorizeRoles("admin"), getAllUser);
router.put("/update", isAuthenticatedUser, updateUserInfo);
router.put(
  "/update-profile-image",
  isAuthenticatedUser,
  multerUpload.single("file"),
  updateUserProfileImage
);
const userRoute = router;
export default userRoute;