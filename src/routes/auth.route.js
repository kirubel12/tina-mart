import express from 'express';
import { login, register } from '../controllers/auth.controller.js';

const authRoute = express.Router();

// Public routes
authRoute.post('/login', login);
authRoute.post('/register', register);

// Protected routes

export default authRoute;
