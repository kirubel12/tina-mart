import { User } from '../models/User.model.js';
import bcryptjs from 'bcryptjs';

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password',
            });
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Incorrect email or password',
                error: 'Authentication failed',
            });
        }

        // Check password
        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Incorrect email or password',
                error: 'Authentication failed',
            });
        }

        // Generate token
        const { token } = user.generateAuthToken();

        user.password = undefined;

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
