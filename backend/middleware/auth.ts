import { NextFunction, Response, Request } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: any;
}

export default function authenticateToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ success: false, error: "Token not found" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded;
    next();
  } catch (error) {
    return res
      .status(403)
      .json({ success: false, error: "Token invalid or expired" });
  }
}
