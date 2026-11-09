const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const {
    getAuthCookieOptions,
    getClearCookieOptions,
} = require("../utils/cookieOptions");

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const validateCredentials = ({ name, email, password }, registration = false) => {
    if (registration && (typeof name !== "string" || name.trim().length < 2 || name.trim().length > 100)) {
        return "Name must contain 2 to 100 characters";
    }
    if (typeof email !== "string" || email.trim().length > 254 || !emailPattern.test(email.trim())) {
        return "A valid email is required";
    }
    if (typeof password !== "string" || [...password].length < 8 || Buffer.byteLength(password, "utf8") > 72) {
        return "Password must contain at least 8 characters and no more than 72 UTF-8 bytes";
    }
    return null;
};

const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
        algorithm: "HS256",
    });
};

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body || {};
        const validationError = validateCredentials({ name, email, password }, true);
        if (validationError) return res.status(422).json({ message: validationError });
        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = await User.findOne({ email: normalizedEmail });

        if (existingUser) {
            return res.status(409).json({
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

        console.error("Registration failed:", error);
        return res.status(500).json({
            message: "Registration failed",
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body || {};
        const validationError = validateCredentials({ email, password });
        if (validationError) return res.status(422).json({ message: validationError });
        const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+password");

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
        console.error("Login failed:", error);
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
