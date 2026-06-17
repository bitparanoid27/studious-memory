// External imports
import { Request, Response, RequestHandler, NextFunction } from "express";

// Internal imports

// Controllers

export const healthMonitor: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.status(200).json({ status: "success", message: "API is up" });
};
