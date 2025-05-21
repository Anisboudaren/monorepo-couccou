import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import prisma from "../utils/prisma.utils";

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: "/v1/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log("Google OAuth callback triggered");
    console.log("Profile received:", profile);

    const email = profile.emails?.[0].value;
    console.log("Extracted email from profile:", email);

    if (!email) {
      console.log("No email found in profile, cannot proceed");
      return done(new Error("No email found in Google profile"));
    }

    let user = await prisma.user.findUnique({
      where: { email }
    });

    console.log("User found in DB:", user);

    if (!user) {
      console.log("User not found, would create new user here");
      // Not creating user yet — just log this
      return done(null, false);
    } else {
      console.log("User exists, proceeding with login");
      return done(null, user);
    }
  } catch (error) {
    console.error("Error in Google strategy callback:", error);
    return done(error);
  }
}));

passport.serializeUser((user: any, done) => {
  console.log("serializeUser called with:", user);
  done(null, user);
});

passport.deserializeUser((obj: any, done) => {
  console.log("deserializeUser called with:", obj);
  done(null, obj);
});
