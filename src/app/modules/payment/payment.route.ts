import { Router } from "express";
import {
  failedPaymentController,
  successPaymentController,
} from "./payment.controller";
const router = Router();
router.post("/success", successPaymentController);
router.post("/fail", failedPaymentController);
router.get("/fail", failedPaymentController);
export default router;