// // config/passport.ts
// import passport from "passport";
// import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// import { Strategy as GitHubStrategy } from "passport-github2";
// import User from "../userModel";

// const isProd = process.env.NODE_ENV === "production";

// export default function setupPassport() {
//   // Google
//   passport.use(
//     new GoogleStrategy(
//       {
//         clientID: process.env.GOOGLE_CLIENT_ID!,
//         clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//         callbackURL: process.env.GOOGLE_CALLBACK_URL!,
//       },
//       async (accessToken, refreshToken, profile, done) => {
//         try {
//           const email = profile.emails?.[0]?.value;
//           if (!email) return done(new Error("No email in Google profile"), null);

//           let user = await User.findOne({ email });
//           if (!user) {
//             user = new User({
//               name: profile.displayName || email,
//               email,
//               password: Math.random().toString(36).slice(2), // random pw (not used)
//               role: "user",
//             });
//             await user.save();
//           }
//           return done(null, user);
//         } catch (err) {
//           return done(err as any, null);
//         }
//       }
//     )
//   );

//   // GitHub
//   passport.use(
//     new GitHubStrategy(
//       {
//         clientID: process.env.GITHUB_CLIENT_ID!,
//         clientSecret: process.env.GITHUB_CLIENT_SECRET!,
//         callbackURL: process.env.GITHUB_CALLBACK_URL!,
//         scope: ["user:email"],
//       },
//       async (accessToken, refreshToken, profile, done) => {
//         try {
//           // GitHub may return multiple emails; pick the primary verified one
//           const email =
//             profile.emails?.find((e: any) => e.primary && e.verified)?.value ||
//             profile.emails?.[0]?.value;

//           if (!email) return done(new Error("No email in GitHub profile"), null);

//           let user = await User.findOne({ email });
//           if (!user) {
//             user = new User({
//               name: profile.displayName || profile.username || email,
//               email,
//               password: Math.random().toString(36).slice(2),
//               role: "user",
//             });
//             await user.save();
//           }
//           return done(null, user);
//         } catch (err) {
//           return done(err as any, null);
//         }
//       }
//     )
//   );

// }