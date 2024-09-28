/* eslint-disable @typescript-eslint/no-explicit-any */
import { IErrorSources, IGenericErrorRes } from "../interface/error";


const handleDuplicateError = (err: any): IGenericErrorRes => {
  const errorSources: IErrorSources = [
    {
      path: "",
      message: err.message,
    },
  ];

  const statusCode = 409;

  return {
    statusCode,
    message: "Duplicate Entry",
    errorSources,
  };
};

export default handleDuplicateError;