/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from "express";

type IResponse<T> = {
  statusCode?: number;
  success: boolean;
  message?: string;
  data: T;
  error?: any;
  totalDoc?: number;
};

const sendResponse = <T>(res: Response, data: IResponse<T>) => {
  res.status(data.statusCode || 200).json({
    success: data.success,
    statusCode: data.statusCode || 200,
    message: data.message,
    data: data.data,
    totalDoc: data.totalDoc,
  });
};

export default sendResponse;