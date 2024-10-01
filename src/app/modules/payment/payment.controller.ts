import jwt from "jsonwebtoken";
import { catchAsyncError } from "../../../utils/catchAsyncError";
import sendResponse from "../../../utils/sendResponse";
import { IPaymentTokenInfo } from "./payment.interface";
import { paymentService } from "./payment.service";
export const successPaymentController = catchAsyncError(async (req, res) => {
  const paymentInfoToken = req.query.pt as string;
  let decode;
  try {
    decode = jwt.verify(paymentInfoToken, process.env.SIGNATURE_KEY as string);
  } catch (error) {
    sendResponse(res, {
      data: null,
      success: false,
      message: "invalid payment info",
      statusCode: 400,
    });
  }

  const { amount, transactionId, userId } = decode as IPaymentTokenInfo;
  const result = await paymentService.createPayment(
    Number(amount),
    transactionId,
    userId
  );
  res.send(result);
});
export const failedPaymentController = catchAsyncError(async (req, res) => {
  const paymentInfoToken = req.query.pt as string;
  try {
    jwt.verify(paymentInfoToken, process.env.SIGNATURE_KEY as string);
  } catch (error) {
    sendResponse(res, {
      data: null,
      success: false,
      message: "invalid payment info",
      statusCode: 400,
    });
  }

  const result = await paymentService.failedPayment();
  res.send(result);
});