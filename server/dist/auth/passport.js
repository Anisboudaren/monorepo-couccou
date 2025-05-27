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
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const prisma_utils_1 = __importDefault(require("../utils/prisma.utils"));
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/v1/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        console.log("Google OAuth callback triggered");
        console.log("Profile received:", profile);
        const email = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0].value;
        console.log("Extracted email from profile:", email);
        if (!email) {
            console.log("No email found in profile, cannot proceed");
            return done(new Error("No email found in Google profile"));
        }
        let user = yield prisma_utils_1.default.user.findUnique({
            where: { email }
        });
        console.log("User found in DB:", user);
        if (!user) {
            console.log("User not found, would create new user here");
            // Not creating user yet — just log this
            return done(null, false);
        }
        else {
            console.log("User exists, proceeding with login");
            return done(null, user);
        }
    }
    catch (error) {
        console.error("Error in Google strategy callback:", error);
        return done(error);
    }
})));
passport_1.default.serializeUser((user, done) => {
    console.log("serializeUser called with:", user);
    done(null, user);
});
passport_1.default.deserializeUser((obj, done) => {
    console.log("deserializeUser called with:", obj);
    done(null, obj);
});
