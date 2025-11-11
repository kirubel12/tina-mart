import type { Context, Hono } from "hono";
import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import {validateEmail, validatePassword} from "../config/validate.js";
import {sign, verify} from "hono/jwt"
import {ENV} from "../config/env.js";

export const registerUser = async(c:Context) => {
    const {
        name,
        email,
        password,
        role,
        phone,
        sex,
        avatar,
        address: { street, city, state, country, postalCode } = {},
    } = await c.req.json();

    const validationErrors = [];
    if (!email) validationErrors.push('Email is required');
    if (!password) validationErrors.push('Password is required');
    if (!name) validationErrors.push('Name is required');
    if (!sex) validationErrors.push('Sex is required');



    if (validationErrors.length > 0) {
        return c.json({ errors: validationErrors }, 400);
    }

    if (!validateEmail(email)) {
        return c.json({ error: 'Please provide a valid email address' }, 400);
    }
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
        return c.json({
            error: 'Password requirements not met',
            requirements: passwordValidation.requirements
        }, 400);
    }

    const hashedPassword = bcryptjs.hashSync(password, 12);

    const existingUser = await User.findOne({email});
    if (existingUser) {
        return c.json({message: "User already exists"}, 400);
    }

    const user = new User({
        name,
        email,
        password: hashedPassword,
        sex,
        ...(role && { role }),
        ...(phone && { phone }),
        ...(avatar && { avatar }),
        ...(street || city || state || country || postalCode ? {
            address: { street, city, state, country, postalCode }
        } : {})
    });

    await user.save();

    return c.json({message: "User registered successfully", user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
            sex: user.sex
        }}, 201);

}

export const loginUser = async (c: Context) => {
    try {
        const { email, password } = await c.req.json();

        const errors: string[] = [];
        if (!email) errors.push("Email is required");
        if (!password) errors.push("Password is required");
        if (errors.length > 0) return c.json({ errors }, 400);

        if (!validateEmail(email))
            return c.json({ error: "Please provide a valid email address" }, 400);

        const user = await User.findOne({ email }).select("+password");
        if (!user) return c.json({ message: "No user associated with this email" }, 401);

        const isPasswordValid = bcryptjs.compareSync(password, user.password);
        if (!isPasswordValid)
            return c.json({ message: "Invalid email or password" }, 401);

        const token = await sign(
            {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                exp: Math.floor(Date.now() / 1000) + 1800
            },
            ENV.JWT_SECRET
        );

        return c.json({
            message: "Login successful",
            token,
            expiresIn: ENV.JWT_EXPIRES_IN,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (e) {
        console.error("Error:", (e as Error).message);
        return c.json({ error: "Internal server error" }, 500);
    }
};

export const validateUserToken = async (c: Context) => {

    const authHeader = c.req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return c.json({ valid: false, message: "No token provided" }, 401);
    }

    const token = authHeader.split(" ")[1];
    try {
        const decoded = await verify(token, ENV.JWT_SECRET);
        return c.json({ valid: true, user: decoded });
    } catch (e) {
        return c.json({ valid: false, message: "Invalid or expired token" }, 401);
    }


}

