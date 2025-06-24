import jwt from 'jsonwebtoken';
import { User } from '../models/User.model.js';
import { ENV } from '../config/env.js';
import bcryptjs from 'bcryptjs';

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1) Check if email and password exist
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password',
            });
        }

        // 2) Check if user exists && password is correct
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Incorrect email or password',
                error: 'Authentication failed',
            });
        }

        // 3) Generate tokens
        const { token, refreshToken } = user.generateAuthToken();

        // 4) Save refresh token to database
        user.refreshToken = refreshToken;
        user.refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
        await user.save({ validateBeforeSave: false });

        // 5) Remove password from output
        user.password = undefined;

        // 6) Send tokens to client
        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: ENV.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(200).json({
            success: true,
            token,
            user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error logging in',
            error: error.message,
        });
    }
};

export const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: 'No refresh token provided',
            });
        }

        // Verify refresh token
        const decoded = jwt.verify(refreshToken, ENV.REFRESH_TOKEN_SECRET);

        // Find user with the refresh token
        const user = await User.findById(decoded.id);

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({
                success: false,
                message: 'Invalid refresh token',
            });
        }


        // Generate new tokens
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = user.generateAuthToken();

        // Update refresh token in database
        user.refreshToken = newRefreshToken;
        user.refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
        await user.save({ validateBeforeSave: false });

        // Send new tokens to client
        res.cookie('jwt', newRefreshToken, {
            httpOnly: true,
            secure: ENV.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(200).json({
            success: true,
            accessToken: newAccessToken,
        });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Refresh token expired',
            });
        }
        res.status(500).json({
            success: false,
            message: 'Error refreshing token',
            error: error.message,
        });
    }
};

export const logout = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                message: 'No refresh token provided',
            });
        }

        // Find user with the refresh token
        const decoded = jwt.verify(refreshToken, ENV.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decoded.id);

        if (user) {
            // Clear refresh token from database
            user.refreshToken = undefined;
            user.refreshTokenExpiry = undefined;
            await user.save({ validateBeforeSave: false });
        }

        // Clear cookie
        res.clearCookie('jwt', {
            httpOnly: true,
            secure: ENV.NODE_ENV === 'production',
            sameSite: 'strict',
        });

        res.status(200).json({
            success: true,
            message: 'Successfully logged out',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error logging out',
            error: error.message,
        });
    }
};

export const register = async (req, res) => {
    try {
        const { name, email, password, phone, address } = req.body;
        if (!name || !email || !password || !phone || !address) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required',
            });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'Email already exists',
            });
        }
        const hashedPassword = await bcryptjs.hash(password, 12);
        const user = await User.create({ name, email, password: hashedPassword, phone, address });
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error registering user',
            error: error.message,
        });
    }
};
