"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const auth_controllers_1 = require("./auth.controllers");
const router = express_1.default.Router();
router.get("/google", passport_1.default.authenticate("google", { scope: ["profile", "email"] }));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const isProduction = process.env.NODE_ENV === "production";
router.get("/google/callback", passport_1.default.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}/v1/login?error=unauthorized`,
    session: false,
}), (req, res) => {
    const user = req.user;
    if (!user) {
        return res.redirect(`${process.env.FRONTEND_URL}/v1/login?error=unauthorized`);
    }
    // Sign JWT with user ID
    const token = jsonwebtoken_1.default.sign({ id: user.id || user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });
    // Set token as cookie
    res.cookie("token", token, {
        path: '/',
        httpOnly: true,
        secure: false,
        sameSite: isProduction ? "none" : "lax",
        domain: ".vercel.app"
    });
    // Redirect to dashboard
    res.redirect(`${process.env.FRONTEND_URL}/v1/dashboard`);
});
router.post("/login", auth_controllers_1.login);
router.get("/logout", auth_controllers_1.logout);
exports.default = router;
