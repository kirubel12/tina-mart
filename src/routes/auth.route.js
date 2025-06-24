import express from 'express';
import { login, register } from '../controllers/auth.controller.js';

const authRouter = express.Router();

// Route for user registration
authRouter.post('/register', register);
// Route for user login
authRouter.post('/login', login);



// Export the auth router
export default authRouter;