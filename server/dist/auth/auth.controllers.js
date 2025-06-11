"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
exports.logout = logout;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_utils_1 = __importDefault(require("../utils/prisma.utils"));
const isProduction = process.env.NODE_ENV === "production";
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = req.body;
        console.log("🔐 Login request received:", { email });
        try {
            const user = yield prisma_utils_1.default.user.findUnique({ where: { email } });
            if (!user || !user.password || !(yield bcrypt_1.default.compare(password, user.password))) {
                console.log("❌ Invalid credentials");
                res.status(401).json({ error: "Invalid credentials" });
            }
            else {
                const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });
                console.log("✅ Token generated:", token);
                res.cookie("token", token, {
                    httpOnly: true,
                    secure: isProduction,
                    sameSite: isProduction ? "none" : "lax",
                    // make sure to remove this in devlpemnt
                    domain: ".devlly.site",
                    maxAge: 24 * 60 * 60 * 1000, // 1 day
                    path: "/",
                });
                console.log("🍪 Cookie set:", {
                    httpOnly: true,
                    secure: isProduction,
                    sameSite: isProduction ? "none" : "lax",
                    maxAge: 24 * 60 * 60 * 1000,
                    path: "/",
                });
                res.status(200).json({ message: "Logged in", token });
            }
        }
        catch (err) {
            console.error("🔥 Login server error:", err);
            res.status(500).json({ error: "Internal server error" });
        }
    });
}
function logout(req, res) {
    console.log("Logout request received");
    console.log("Cookies before clearing:", req.headers.authorization);
    res.clearCookie("token", {
        path: '/',
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax"
    });
    res.json({ message: "Logged out successfully" });
}
