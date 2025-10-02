import User from '../models/auth.model.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { imagekit } from "../config/imagekit.js";

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const userExist = await User.findOne({ email })

    if (userExist) {
      return res.status(400).json({
        code: "EMAIL_EXISTS",
        message: "Email already registered"
      })
    }

    const newUser = await User.create({
      name, email, password
    })

    res.status(201).json({ message: "User Registered" })

  } catch (error) {
    next(error)
  }
}

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        code: "MISSING_FIELDS",
        message: "All fields are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        code: "INVALID_CREDENTIALS",
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        code: "INVALID_CREDENTIALS",
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 1000
    });

    res.status(200).json({
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });


  } catch (error) {
    next(error);
  }
};

export const getUserInfo = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password")
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ data: user })
  } catch (error) {
    next(error)
  }
}

export const logout = async (req, res, next) => {
  try {
    res.clearCookie('token', { httpOnly: true, secure: false, sameSite: 'strict' })
    res.status(200).json({ message: 'Logged out' });
  } catch (error) {
    next(error)
  }
}

export const updateUserInfo = async (req, res, next) => {
  try {
    const { name, bio } = req.body
    const userId = req.user.id

    const user = await User.findById(userId)
    if (!user) {
      res.status(400).json({ message: "User not found" })
    }

    if (name) user.name = name
    if (bio) user.bio = bio

    await user.save();

    res.status(200).json({ message: 'User Updated!!!' })

  } catch (error) {
    next(error)
  }
}

export const uploadProfilePic = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const uploadResponse = await imagekit.upload({
      file: req.file.buffer,
      fileName: `${Date.now()}_${req.file.originalname}`,
      folder: "/Hive/User_Profile_Pictures",
    });

    const userId = req.user.id;
    await User.findByIdAndUpdate(userId, { profileImage: uploadResponse.url });

    res.status(200).json({ message: 'upload success', url: uploadResponse.url });
  } catch (err) {
    next(err);
  }
};

export const getUserInfoById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select("name bio username profileImage");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
