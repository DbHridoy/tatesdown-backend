import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { apiError } from "../errors/api-error";
import { formatZodError } from "../errors/zodErrorFormatter";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let message: any;
  let statusCode: number;

  if (err instanceof ZodError) {
    statusCode = 400;
    message = formatZodError(err);
    return res.status(statusCode).json({ message });
  } else if (err instanceof apiError) {
    statusCode = err.statusCode;
    message = err.message;
    return res.status(statusCode).json({ message });
  } else {
    return res.status(500).json({ message: "Internal server error" });
  }
};
