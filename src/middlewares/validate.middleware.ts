import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";
import { formatZodError } from "../errors/zodErrorFormatter";

export const validate = (schema: ZodType<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      // Validation failed → send clean formatted error
      return res.status(400).json({
        success: false,
        errors: formatZodError(result.error),
      });
    }

    // Validation succeeded → replace body with parsed data
    req.body = result.data;
    next();
  };
};
