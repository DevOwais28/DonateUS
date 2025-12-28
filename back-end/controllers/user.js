import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import Donation from "../models/donation.js";
import upload from "../middlewares/upload.js";
import { sendVerificationEmail, sendPasswordResetEmail } from "../services/emailService.js";

// Create a new user
const createUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      console.log('Name, email or password is missing');
      return res.status(400).send({
        success: false,
        message: 'Name, email and password are required'
      });
    }

    const isUserExist = await User.findOne({ 
      email: email, 
      isDeleted: { $ne: true },
      googleId: { $exists: false }
    });
    
    if (isUserExist) {
      console.log('User already exists with this email (email/password account)');
      return res.status(400).send({
        success: false,
        message: `User already exists with this email`,
      });
    }
    
    // Check if there's an existing Google account with this email
    const googleUserExists = await User.findOne({ 
      email: email, 
      isDeleted: { $ne: true },
      googleId: { $exists: true }
    });
    
    if (googleUserExists) {
      console.log('Google account exists with this email');
      return res.status(400).send({
        success: false,
        message: `This email is already registered with Google. Please use Google login or use a different email.`,
      });
    }
    
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const userObj = {
      name,
      email,
      password: hashedPassword,
      phone: phone || '',
    };
    
    const newUser = await User.create(userObj);
    console.log('User created successfully:', newUser._id);
    
    // Generate email verification token
    const verificationToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    
    console.log('Generated verification token');
    
    // Update user with verification token
    await User.findByIdAndUpdate(newUser._id, {
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpires
    });
    
    console.log('Verification token updated for user');
    
    // Send verification email
    const emailSent = await sendVerificationEmail(email, verificationToken);
    if (!emailSent) {
      console.log('Failed to send verification email, but user was created');
    }
    
    console.log('Verification token for', email, ':', verificationToken);
    
    console.log('Sending success response');
    return res.status(201).send({
      success: true,
      message: `User created successfully. Please check your email to verify your account.`,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        picture: newUser.picture,
        googleId: newUser.googleId
      },
      verificationToken
    });
    
  } catch (error) {
    console.error('Error in createUser:', error);
    return res.status(500).send({
      success: false,
      message: 'Error creating user',
      error: error.message
    });
  }
};

// User sign in
const signinUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: 'Email and password are required'
      });
    }
    
    const user = await User.findOne({ email, isDeleted: { $ne: true } }).select('+password');
    
    if (!user) {
      return res.status(404).send({
        success: false,
        message: 'User not found',
      });
    }

    const passwordMatched = await bcrypt.compare(password, user.password);
    
    if (!passwordMatched) {
      return res.status(401).send({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check if user is verified (only for non-Google OAuth users)
    if (!user.isVerified && !user.googleId) {
      return res.status(403).send({
        success: false,
        message: 'Please verify your email before logging in. Check your inbox for verification email.',
        requiresVerification: true,
        email: user.email
      });
    }

    // Generate JWT token
    console.log('JWT_SECRET available:', !!process.env.JWT_SECRET);
    console.log('JWT_SECRET value:', process.env.JWT_SECRET);
    
    const jwtSecret = process.env.JWT_SECRET || 'temporary-secret-key-fix';
    
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      jwtSecret,
      { expiresIn: '7d' }
    );

    const safeUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      picture: user.picture,
      googleId: user.googleId
    };

    return res.status(200).send({
      success: true,
      message: 'Login successful',
      user: safeUser,
      token,
    });
    
  } catch (error) {
    console.error('Error in signinUser:', error);
    return res.status(500).send({
      success: false,
      message: 'Error during sign in',
      error: error.message
    });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('name email role picture googleId createdAt provider isDeleted phone');
    return res.status(200).send({
      success: true,
      user: user,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: 'Error fetching user',
      error: error.message,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const userId = req.user.id;

    if (!name || !email) {
      return res.status(400).send({
        success: false,
        message: 'Name and email are required'
      });
    }

    // Check if email is already taken by another user
    const existingUser = await User.findOne({ email, _id: { $ne: userId }, isDeleted: { $ne: true } });
    if (existingUser) {
      return res.status(400).send({
        success: false,
        message: 'Email is already taken by another user'
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, phone: phone || '' },
      { new: true }
    ).select('name email role picture createdAt phone');

    return res.status(200).send({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error in updateProfile:', error);
    return res.status(500).send({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).send({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).send({
        success: false,
        message: 'New password must be at least 6 characters long'
      });
    }

    const user = await User.findById(userId).select('+password');
    if (!user) {
      return res.status(404).send({
        success: false,
        message: 'User not found'
      });
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).send({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    await User.findByIdAndUpdate(userId, { password: hashedNewPassword });

    return res.status(200).send({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Error in updatePassword:', error);
    return res.status(500).send({
      success: false,
      message: 'Error updating password',
      error: error.message
    });
  }
};

const updateProfilePicture = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get image URL from Cloudinary (uploaded by multer-storage-cloudinary)
    const imageUrl = req.file ? req.file.path : '';

    if (!imageUrl) {
      return res.status(400).send({
        success: false,
        message: 'No image uploaded'
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { picture: imageUrl },
      { new: true }
    ).select('name email role picture createdAt');

    return res.status(200).send({
      success: true,
      message: 'Profile picture updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error in updateProfilePicture:', error);
    return res.status(500).send({
      success: false,
      message: 'Error updating profile picture',
      error: error.message
    });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    
    if (!token) {
      return res.status(400).send({
        success: false,
        message: 'Verification token is required'
      });
    }
    
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).send({
        success: false,
        message: 'Invalid or expired verification token'
      });
    }
    
    // Mark user as verified and clear verification token
    await User.findByIdAndUpdate(user._id, {
      isVerified: true,
      emailVerificationToken: undefined,
      emailVerificationExpires: undefined
    });
    
    return res.status(200).send({
      success: true,
      message: 'Email verified successfully',
      userEmail: user.email
    });
    
  } catch (error) {
    console.error('Error in verifyEmail:', error);
    return res.status(500).send({
      success: false,
      message: 'Error verifying email',
      error: error.message
    });
  }
};

const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).send({
        success: false,
        message: 'Email is required'
      });
    }
    
    const user = await User.findOne({ email, isDeleted: { $ne: true } });
    
    if (!user) {
      return res.status(404).send({
        success: false,
        message: 'User not found'
      });
    }
    
    if (user.isVerified) {
      return res.status(400).send({
        success: false,
        message: 'Email is already verified'
      });
    }
    
    // Return the existing verification token (don't generate new one)
    const verificationToken = user.emailVerificationToken;
    
    if (!verificationToken) {
      // Generate new token if none exists
      const newToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      
      await User.findByIdAndUpdate(user._id, {
        emailVerificationToken: newToken,
        emailVerificationExpires: verificationExpires
      });
      
      console.log('Generated new verification token for', email, ':', newToken);
      
      return res.status(200).send({
        success: true,
        message: 'Verification email sent successfully',
        token: newToken
      });
    }
    
    console.log('Using existing verification token for', email, ':', verificationToken);
    
    return res.status(200).send({
      success: true,
      message: 'Verification email sent successfully',
      token: verificationToken
    });
  } catch (error) {
    console.error('Error in resendVerification:', error);
    return res.status(500).send({
      success: false,
      message: 'Error resending verification email',
      error: error.message
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.user.id;
    
    if (!userId) {
      return res.status(400).send({
        success: false,
        message: 'User ID is required'
      });
    }
    
    // Remove user association from donations but preserve donation records
    await Donation.updateMany(
      { userId: userId },
      { 
        $unset: { userId: 1, googleId: 1 },
        $set: { 
          donorNote: 'Account deleted - donation preserved for records',
          accountDeletedAt: new Date()
        }
      }
    );
    
    // Actually delete the user
    await User.findByIdAndDelete(userId);
    
    console.log('User deleted successfully, donations preserved:', userId);
    
    return res.status(200).send({
      success: true,
      message: 'Account deleted successfully'
    });
    
  } catch (error) {
    console.error('Error in deleteUser:', error);
    return res.status(500).send({
      success: false,
      message: 'Error deleting account',
      error: error.message
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).send({
        success: false,
        message: 'Email is required'
      });
    }
    
    const user = await User.findOne({ email, isDeleted: { $ne: true } });
    
    if (!user) {
      // Don't reveal if user exists or not for security
      return res.status(200).send({
        success: true,
        message: 'If an account with this email exists, a password reset link has been sent.'
      });
    }
    
    // Generate reset token
    const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    
    console.log('Generated reset token:', resetToken);
    console.log('User ID:', user._id);
    console.log('Reset expires at:', resetExpires);
    
    try {
      const updateResult = await User.findByIdAndUpdate(user._id, {
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetExpires
      });
      console.log('Update result:', updateResult);
    } catch (updateError) {
      console.error('Error updating user with reset token:', updateError);
    }
    
    // Verify token was saved
    const updatedUser = await User.findById(user._id);
    console.log('Token saved to database:', !!updatedUser.resetPasswordToken);
    console.log('Saved token:', updatedUser.resetPasswordToken);
    console.log('Token expires at:', updatedUser.resetPasswordExpires);
    
    // Send reset email (you'll need to implement this email service)
    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;
    console.log('Password reset link for', email, ':', resetLink);
    
    // TODO: Implement actual email sending
    // For now, just log the token
    console.log('Reset token generated for', email, ':', resetToken);
    
    return res.status(200).send({
      success: true,
      message: 'If an account with this email exists, a password reset link has been sent.',
      token: resetToken // For development only
    });
    
  } catch (error) {
    console.error('Error in forgotPassword:', error);
    return res.status(500).send({
      success: false,
      message: 'Error processing password reset',
      error: error.message
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;
    
    console.log('Reset password request received');
    console.log('Token:', token);
    console.log('New password provided:', !!newPassword);
    console.log('New password length:', newPassword?.length);
    
    if (!token || !newPassword) {
      console.log('Missing token or password');
      return res.status(400).send({
        success: false,
        message: 'Reset token and new password are required'
      });
    }
    
    if (newPassword.length < 6) {
      console.log('Password too short:', newPassword.length);
      return res.status(400).send({
        success: false,
        message: 'New password must be at least 6 characters long'
      });
    }
    
    console.log('Looking for user with reset token...');
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    
    console.log('User found:', !!user);
    if (user) {
      console.log('User email:', user.email);
      console.log('Token expires at:', user.resetPasswordExpires);
      console.log('Current time:', Date.now());
    }
    
    if (!user) {
      console.log('Invalid or expired token');
      return res.status(400).send({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }
    
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    
    await User.findByIdAndUpdate(user._id, {
      password: hashedPassword,
      resetPasswordToken: undefined,
      resetPasswordExpires: undefined
    });
    
    console.log('Password reset successfully for:', user.email);
    
    return res.status(200).send({
      success: true,
      message: 'Password reset successfully'
    });
    
  } catch (error) {
    console.error('Error in resetPassword:', error);
    return res.status(500).send({
      success: false,
      message: 'Error resetting password',
      error: error.message
    });
  }
};

export { createUser, signinUser, getMe, updateProfile, updatePassword, updateProfilePicture, verifyEmail, resendVerification, deleteUser, forgotPassword, resetPassword };