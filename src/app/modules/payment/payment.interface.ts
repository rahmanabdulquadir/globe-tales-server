export interface IPayment {
  amount: number;
  transactionId: string;
  status: string;
}
export interface IPaymentPayload {
  amount: number;
  cus_name: string;
  cus_email: string;
  cus_phone: string;
  cus_add: string;
  tran_id: string;
}

export interface IPaymentTokenInfo {
  transactionId: string;
  slotId: string;
  amount: string;
}