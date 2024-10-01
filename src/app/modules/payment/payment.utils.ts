import axios from "axios";
import jwt from "jsonwebtoken";
import { IPaymentPayload, IPaymentTokenInfo } from "./payment.interface";

export const initiatePayment = async (
  payload: IPaymentPayload,
  userId: string
) => {
  const { amount, cus_add, cus_name, cus_phone, cus_email, tran_id } = payload;

  const paymentTokenObj: IPaymentTokenInfo = {
    transactionId: tran_id,
    userId,
    amount: amount.toString(),
  };

  const PT = jwt.sign(paymentTokenObj, process.env.SIGNATURE_KEY as string, {
    expiresIn: "1m",
  });

  // const url = "https://onthego-backend.vercel.app/api/v1"
  const url = "http://localhost:5000/api/v1";

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
    success_url: `${url}/payment/success?pt=${PT}`,
    fail_url: `${url}/payment/fail?pt=${PT}`,
    cancel_url: `${url}/payment/fail?pt=${PT}`,
    desc: "Course Fee",
    type: "json",
  });

  return response.data;
};