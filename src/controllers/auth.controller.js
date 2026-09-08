const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const {
    getAuthCookieOptions,
    getClearCookieOptions,
} = require("../utils/cookieOptions");

const normalizeEmail = (email) => email.trim().toLowerCase();

const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
};

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name?.trim() || !email?.trim() || !password) {
            return res.status(400).json({
                message: "Name, email, and password are required",
            });
        }

        const normalizedEmail = normalizeEmail(email);

        if (!isValidEmail(normalizedEmail)) {
            return res.status(400).json({ message: "A valid email is required" });
        }

        if (password.length < 6) {
            return res
                .status(400)
                .json({ message: "Password must be at least 6 characters" });
        }

        const existingUser = await User.findOne({ email: normalizedEmail });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists",
            });
        }

        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password,
        });

        const token = generateToken(user._id);

        res.cookie("token", token, getAuthCookieOptions());

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: "User already exists" });
        }

        return res.status(500).json({
            message: "Registration failed",
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email?.trim() || !password) {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }

        const normalizedEmail = normalizeEmail(email);

        if (!isValidEmail(normalizedEmail)) {
            return res.status(400).json({ message: "A valid email is required" });
        }

        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(401).json({
                message: "Invalid credentials",
            });
        }

        const isPasswordMatched = await user.comparePassword(password);

        if (!isPasswordMatched) {
            return res.status(401).json({
                message: "Invalid credentials",
            });
        }

        const token = generateToken(user._id);

        res.cookie("token", token, getAuthCookieOptions());

        return res.status(200).json({
            message: "Login successful",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        return res.status(500).json({
            message: "Login failed",
        });
    }
};

const getCurrentUser = async (req, res) => {
    return res.status(200).json({
        message: "Current user fetched successfully",
        user: {
            _id: req.user._id,
            name: req.user.name,
            email: req.user.email,
        },
    });
};

const logoutUser = async (req, res) => {
    try {
        res.clearCookie("token", getClearCookieOptions());

        return res.status(200).json({
            message: "Logout successful",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Logout failed",
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getCurrentUser,
    logoutUser,
};
