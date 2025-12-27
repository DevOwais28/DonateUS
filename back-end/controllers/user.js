import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const secret = process.env.JWT_SECRET;
import User from "../models/user.js";
import upload from "../middlewares/upload.js";

// Create a new user
const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).send({
        success: false,
        message: 'Name, email and password are required'
      });
    }

    const isUserExist = await User.findOne({ email: email });
    
    if (isUserExist) {
      return res.status(400).send({
        success: false,
        message: `User already exists with this email`,
      });
    }
    
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const userObj = {
      name,
      email,
      password: hashedPassword,
    };
    
    const newUser = await User.create(userObj);
    
    // Generate JWT token
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role },
      secret,
      { expiresIn: '1d' }
    );
    
    return res.status(201).send({
      success: true,
      message: `User created successfully`,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        picture: newUser.picture,
        googleId: newUser.googleId
      },
      token
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
    
    const user = await User.findOne({ email }).select('+password');
    
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

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      secret,
      { expiresIn: '1d' }
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
    const user = await User.findById(req.user.id).select('name email role picture googleId createdAt provider');
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
    const { name, email } = req.body;
    const userId = req.user.id;

    if (!name || !email) {
      return res.status(400).send({
        success: false,
        message: 'Name and email are required'
      });
    }

    // Check if email is already taken by another user
    const existingUser = await User.findOne({ email, _id: { $ne: userId } });
    if (existingUser) {
      return res.status(400).send({
        success: false,
        message: 'Email is already taken by another user'
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true }
    ).select('name email role picture createdAt');

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

export { createUser, signinUser, getMe, updateProfile, updatePassword, updateProfilePicture };