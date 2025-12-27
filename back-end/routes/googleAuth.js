import passport from "passport";
import express from "express"
import jwt from "jsonwebtoken";

const router = express.Router();

// Single Google OAuth endpoint for both sign-in and sign-up
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account" // Show account selector
  })
);


router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    try {
      const { user, isNewUser } = req.user;
      console.log('Google auth callback user:', user);
      console.log('Google auth user.picture:', user.picture);
      console.log('Google auth user.googleId:', user.googleId);
      
      // Create JWT
      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role || 'user' },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      const finalData = {
        login: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          picture: user.picture,
          googleId: user.googleId,
          provider: 'google',
          role: user.role || 'user',
          isNewUser: isNewUser || false
        },
        token,
      };
      
      console.log('Google auth finalData.user:', finalData.user);
      
      const encoded = encodeURIComponent(JSON.stringify(finalData));
      
      // Redirect to auth callback route with auth data
      res.redirect(`${process.env.CLIENT_URL}/auth/callback?auth=${encoded}`);
    } catch (error) {
      console.error('Google auth error:', error);
      res.redirect(`${process.env.CLIENT_URL}/login?error=authentication_failed`);
    }
  }
);

export default router;


// useEffect(() => {

//   if (dataParam) {
    
//     localStorage.setItem("user", JSON.stringify(parsed.user));
//     localStorage.setItem("token", parsed.token);

//     // Remove ?data= from URL
//     window.history.replaceState({}, "", window.location.pathname);
//   }
// }, []);
