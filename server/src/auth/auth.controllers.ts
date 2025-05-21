import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import prisma from "../utils/prisma.utils";
import { Request, Response } from "express";


export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  console.log("Login request received:", req.body);
  
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !user.password || !await bcrypt.compare(password, user.password)) {
     res.status(401).json({ error: "Invalid credentials" });
  }
else {
const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: "1d" });
console.log(token)
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax"
  });
  res.json({ message: "Logged in", token });
}
  
}

export function logout(req: Request, res: Response) {
  console.log("Logout request received");
  console.log("Cookies before clearing:", req.headers.authorization);
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });
  res.json({ message: "Logged out successfully" });
}
