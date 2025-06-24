import express from 'express';
import { login, logout, refreshToken, register } from '../controllers/auth.controller.js';
import { verifyRefreshToken } from '../middleware/auth.js';

const authRoute = express.Router();

// Public routes
authRoute.post('/login', login);
authRoute.post('/register', register);

// Protected routes
authRoute.post('/refresh-token', verifyRefreshToken, refreshToken);
authRoute.post('/logout', verifyRefreshToken, logout);

export default authRoute;
