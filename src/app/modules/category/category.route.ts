import { Router } from "express";
import { authorizeRoles, isAuthenticatedUser } from "../../middlewares/auth";
import { categoryController } from "./category.controller";
const router = Router();
router.get("/get", categoryController.getCategories);
router.get("/get/:label", categoryController.getCategoriesByName);
router.post(
  "/create",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  categoryController.createCategory
);

router.delete(
  "/delete/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  categoryController.deleteCategory
);

const categoryRoute = router;
export default categoryRoute;