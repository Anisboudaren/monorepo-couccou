// types/express.d.ts or wherever you're keeping shared types
import type { User } from "@prisma/client";
import type { Request } from "express";

export interface AuthenticatedRequest extends Request {
  user?: User;
}
