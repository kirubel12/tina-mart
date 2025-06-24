import jwt from "jsonwebtoken";
import {User} from "../models/User.model.js";
import { ENV } from "../config/env.js";

export const authMiddleware = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }
        if (!token) {
            return res.status(401).json({ success: false, message: "No token provided" });
        }

        const decoded = jwt.verify(token, ENV.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password -refreshToken');

        if (!user) {
            return res.status(401).json({ success: false, message: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: "Access token expired",
                code: "TOKEN_EXPIRED"
            });
        }
        return res.status(401).json({ success: false, message: "Invalid token" });
    }
};


export const checkRole = (roles = []) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "User not authenticated" });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: "Insufficient permissions" });
        }

        next();
    };
};
