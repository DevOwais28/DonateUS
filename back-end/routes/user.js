import express from "express"
import { signinUser, createUser, getMe, updateProfile, updatePassword, updateProfilePicture } from "../controllers/user.js";
import authenticate from "../middlewares/authentication.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

router.post("/login", signinUser);
router.post("/signup", createUser);
router.get('/me', authenticate, getMe);
router.put('/profile', authenticate, updateProfile);
router.put('/password', authenticate, updatePassword);
router.post('/profile-picture', authenticate, upload.single('image'), updateProfilePicture);

export default router;