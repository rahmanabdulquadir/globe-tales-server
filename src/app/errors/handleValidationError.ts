import mongoose from "mongoose";
import { IErrorSources, IGenericErrorRes } from "../interface/error";

const handleValidationError = (err: mongoose.Error.ValidationError): IGenericErrorRes => {
  const errorSources: IErrorSources = Object.values(err.errors).map((el) => {
    return { path: el.path, message: el.message };
  });

  const statusCode = 400;

  return {
    statusCode,
    message: "Validation Error",
    errorSources,
  };
};

export default handleValidationError;