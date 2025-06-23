import dotenv from 'dotenv';
import assert from 'assert';

// Load variables from .env file
dotenv.config();

// Validate required variables
assert(process.env.MONGO_URI, 'MONGO_URI is required');
assert(process.env.JWT_SECRET, 'JWT_SECRET is required');
assert(process.env.PORT, 'PORT is required');

// Export them as typed constants
export const ENV = {
    NODE_ENV: process.env.NODE_ENV,
    PORT: parseInt(process.env.PORT, 10),
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    CLIENT_URL: process.env.CLIENT_URL,
};
