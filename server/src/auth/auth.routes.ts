import express from "express";
import passport from "passport";
import { login, logout } from "./auth.controllers";

const router = express.Router();

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

import jwt from "jsonwebtoken";
const isProduction = process.env.NODE_ENV === "production"
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}/v1/login?error=unauthorized`,
    session: false,
  }),
  (req, res) => {
    const user = req.user;
    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL}/v1/login?error=unauthorized`);
    }

    // Sign JWT with user ID
    const token = jwt.sign({ id: (user as any).id || (user as any)._id }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });

    // Set token as cookie
    res.cookie("token", token, {
      path : '/',
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax"
    });

    // Redirect to dashboard
    res.redirect(`${process.env.FRONTEND_URL}/v1/dashboard`);
  }
);


router.post("/login" , login)

router.get("/logout", logout)


export default router;
