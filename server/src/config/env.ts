import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const required = (name: string): string => {
    const value = process.env[name];
    if (!value) {
        throw new Error(`❌ Missing required environment variable: ${name}`);
    }
    return value;
};

// Define the shape of your config
export const ENV = {
    NODE_ENV: (process.env.NODE_ENV || "development") as "development" | "production" | "test",
    PORT: Number(process.env.PORT),
    MONGO_URI: required("MONGODB_URI"),
    JWT_SECRET: required("JWT_SECRET"),
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",

} as const;

export type EnvConfig = typeof ENV;
