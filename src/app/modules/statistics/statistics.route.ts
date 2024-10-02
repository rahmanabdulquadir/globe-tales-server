import { Router } from "express";
import { authorizeRoles, isAuthenticatedUser } from "../../middlewares/auth";
import {
  getUserStatistics,
  paymentStatisticsController,
} from "./statistics.controller";

const router = Router();

router.get(
  "/payment",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  paymentStatisticsController
);

router.get(
  "/user",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  getUserStatistics
);

const statisticsRoute = router;
export default statisticsRoute;