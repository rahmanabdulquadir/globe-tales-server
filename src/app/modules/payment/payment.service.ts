import { readFileSync } from "fs";
import { join } from "path";
import User from "../user/user.model";
import Payment from "./payment.model";

export const createPayment = async (
  amount: number,
  transactionId: string,
  userId: string
) => {
  await Payment.create({
    amount: amount,
    transactionId,
    status: "Paid",
  });

  await User.findByIdAndUpdate(userId, {
    isPremium: true,
  });

  const filePath = join(__dirname, "../../templates/success.html");
  let file = readFileSync(filePath, "utf-8");
  file = file.replace("{{link}}", "/");

  return file;
};
export const failedPayment = async () => {
  const filePath = join(__dirname, "../../templates/error.html");
  let file = readFileSync(filePath, "utf-8");
  file = file.replace("{{link}}", "/");
  return file;
};

export const paymentService = {
  createPayment,
  failedPayment,
};
