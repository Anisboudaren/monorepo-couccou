import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../utils/prisma.utils";


export interface AuthenticatedRequest extends Request {
  user?: any; 
}

 export default async function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction)  {
  const token = req.cookies?.token;

  if (!token) {
      res.status(401).json({ error: "No token, authorization denied" });
  } else {
try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

    // Optionally fetch the full user data from DB
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user) {
        res.status(401).json({ error: "User not found" });
    } else {
       req.user = user; // Attach user to request
       next();
    }

  } catch (err) {
    res.status(403).json({ error: "Token is not valid" });
  }
  }

}
