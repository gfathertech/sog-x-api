import dotenv from "dotenv";
import express from "express";
import jwt from "jsonwebtoken";
import User from "./userModel";
import { logger } from "../config/logger";
import { auth } from "../middleware/authM"; // Your new auth middleware
// import passport from "passport";

// add near top with cookieOptions/isProd defined
const FRONTEND_URL = process.env.CLIENT_URL || "http://localhost:5174";

dotenv.config();

const authRouter = express.Router();
const isProd = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isProd,
  samesite: isProd ? 'none': 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days, matches token expiry
}

// REGISTER
authRouter.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, confirmPassword } = req.body;
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "User exists, recheck email" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords don't match" });
    }
    if (!role) {
      return res.status(400).json({message: "Role not yet inputed"});
    }
    const user = new User({ name, email, password, role });
    await user.save();
    logger.info("User saved");

    // create token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    // --- MODIFICATION START ---
    // Instead of sending the token in the body, we set it in a secure cookie.
    res.cookie('token', token, cookieOptions);
    // --- MODIFICATION END ---

    res.status(201).json({
      message: "User registration successful",
      // The token is NO LONGER sent here.
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// LOGIN
authRouter.post("/login", async (req, res) => {
  try {
    // ... (Your existing login logic is good, no changes here)
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid credentials" });

    // create token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    // --- MODIFICATION START ---
    // Set the token in a secure, HttpOnly cookie.
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    // --- MODIFICATION END ---

    return res.status(200).json({
      message: "Login Successful",
      // The token is NO LONGER sent here.
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

// --- NEW ROUTE ---
// LOGOUT
authRouter.post("/logout", (req, res) => {
  // To log out, we simply clear the cookie.
  res.clearCookie('token',  {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? 'none': 'lax',
  expires: new Date(0),
});
  res.status(200).json({ message: "Logout successful" });
});


// authRouter.get(
//   "/google",
//   passport.authenticate("google", { scope: ["profile", "email"], session: false })
// );

// authRouter.get(
//   "/google/callback",
//   passport.authenticate("google", { session: false, failureRedirect: `${FRONTEND_URL}/auth/login` }),
//   (req: any, res) => {
//     // req.user provided by passport (a Mongoose user doc)
//     const user = req.user;
//     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: "7d" });

//     // Set cookie (same options you use elsewhere)
//     res.cookie("token", token, cookieOptions);

//     // Redirect back to frontend — the frontend will call /api/auth/me to load user
//     res.redirect(`${FRONTEND_URL}/auth/oauth-success`);
//   }
// );

// // GitHub routes
// authRouter.get("/github", passport.authenticate("github", { scope: ["user:email"], session: false }));

// authRouter.get(
//   "/github/callback",
//   passport.authenticate("github", { session: false, failureRedirect: `${FRONTEND_URL}/auth/login` }),
//   (req: any, res) => {
//     const user = req.user;
//     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: "7d" });
//     res.cookie("token", token, cookieOptions);
//     res.redirect(`${FRONTEND_URL}/auth/oauth-success`);
//   }
// );


// Your protected routes below remain unchanged, as they rely on the `auth` middleware.
// PROFILE (protected)
authRouter.get("/profile", auth, async (req: any, res) => {
  try {
    const { id } = req.body;
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json(user);
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ message: "Server error" });
  }});
// Get current user
authRouter.get("/me", auth, async (req: any, res) => {
 try {
    const user = await User.findById(req.user.userId).select("-password");
    console.log(`user :::::${user}`)
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }});
// Update current user
authRouter.put("/me", auth, async (req: any, res) => {
 try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.user.userId, updates, { new: true }).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }});

export default authRouter;