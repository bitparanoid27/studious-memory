//
import { ErrorRequestHandler } from "express";

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({
    message: "Internal error something went, wrong.",
  });
};

export { globalErrorHandler };
