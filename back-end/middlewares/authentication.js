import jwt from "jsonwebtoken";
import User from "../models/user.js";

const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Access Denied. No token provided."
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token || token === 'null' || token === 'undefined') {
      return res.status(401).json({
        success: false,
        message: "Access Denied. Token format invalid."
      });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('JWT_SECRET is not defined in environment variables');
      return res.status(500).json({
        success: false,
        message: "Server configuration error."
      });
    }

    const decoded = jwt.verify(token, secret);

    User.findById(decoded.id)
      .select('name email role')
      .then((user) => {
        if (!user) {
          return res.status(401).json({
            success: false,
            message: 'Invalid token (user not found).'
          });
        }

        req.user = {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
          name: user.name,
        };
        next();
      })
      .catch((e) => {
        console.error('Authentication user lookup error:', e);
        return res.status(500).json({
          success: false,
          message: 'Authentication error.'
        });
      });
  } catch (error) {
    console.error('Authentication error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: "Invalid token."
      });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: "Token expired."
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Authentication error."
      });
    }
  }
};

export default authenticate;

