import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const auth = (req: Request & {user?:any}, res: Response, next: NextFunction) => {
  // 1. Get token from the cookie
  try {
    let token = req.cookies?.token;

  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')
) {
    token = req.headers.authorization.split('')[1];
  }
  if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided fr Middleback" });
  }
  
   const payload = jwt.verify(token, process.env.JWT_SECRET!); (req as any).user = payload;
    return next();

  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};