import axios from "axios";
import jwt from "jsonwebtoken";
import { IPaymentPayload } from "./payment.interface";

export const initiatePayment = async (
  payload: IPaymentPayload,
  slotId: string
) => {
  const { amount, cus_add, cus_name, cus_phone, cus_email, tran_id } = payload;

  const PT = jwt.sign(
    { transactionId: tran_id, slotId, amount },
    process.env.SIGNATURE_KEY as string,
    { expiresIn: "1m" }
  );
  const response = await axios.post(`${process.env.PAYMENT_URL}`, {
    store_id: process.env.STORE_ID,
    signature_key: process.env.SIGNATURE_KEY,
    cus_name,
    cus_email,
    cus_phone,
    cus_add1: cus_add,
    cus_add2: "N/A",
    cus_city: "N/A",
    cus_country: "Bangladesh",
    currency: "BDT",
    amount,
    tran_id,
    success_url: `https://aqua-clean-server.vercel.app//api/payment/success?pt=${PT}`,
    fail_url: `https://aqua-clean-server.vercel.app//api/payment/fail?pt=${PT}`,
    cancel_url: `https://aqua-clean-server.vercel.app//api/payment/fail?pt=${PT}`,
    desc: "Course Fee",
    type: "json",
  });

  return response.data;
};