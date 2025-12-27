import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.js";

console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID);
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'NOT SET');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:4000/api/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('Google profile received:', profile);
        const googleId = profile.id;
        const name = profile.displayName;
        const email = profile.emails?.[0]?.value;
        const picture = profile.photos?.[0]?.value;
        
        console.log('Extracted data:', { googleId, name, email, picture });

        // Check if user already exists by googleId
        let user = await User.findOne({ googleId });
        let isNewUser = false;
        
        if (!user) {
          // Check if user exists by email
          user = await User.findOne({ email });
          
          if (user) {
            // Update existing user with Google info
            user.googleId = googleId;
            if (picture) user.picture = picture;
            user.provider = 'google';
            await user.save();
            isNewUser = false;
            console.log('Updated existing user with Google info');
          } else {
            // Create new user
            user = await User.create({
              googleId,
              name,
              email,
              picture,
              provider: 'google'
            });
            isNewUser = true;
            console.log('Created new Google user');
          }
        } else {
          // Update existing Google user with latest picture
          if (picture && user.picture !== picture) {
            user.picture = picture;
            await user.save();
          }
        }
        
        console.log('Final user object:', user);
        
        return done(null, { user, isNewUser });
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

export default passport;