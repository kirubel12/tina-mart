
import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: "customer" | "admin" | "vendor";
    sex: string,
    phone?: string;
    avatar?: string;
    address?: {
        street?: string;
        city?: string;
        state?: string;
        country?: string;
        postalCode?: string;
    };
    cart: mongoose.Types.ObjectId[];
    isEmailVerified: boolean;
    lastLogin?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: 6,
            select: false, // hide from queries by default
        },
        role: {
            type: String,
            enum: ["customer", "admin", "vendor"],
            default: "customer",
        },
        sex: {
            type: String,
            enum: ["male", "female"],
            required: true,
        },
        phone: String,
        avatar: {
            type: String,
            default:
                "https://cdn-icons-png.flaticon.com/512/149/149071.png",
        },
        address: {
            street: String,
            city: String,
            state: String,
            country: String,
            postalCode: String,
        },
        cart: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "CartItem",
            },
        ],
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        lastLogin: Date,
    },
    { timestamps: true }
);

// 🔐 Hash password before save

const User = mongoose.model<IUser>("User", userSchema);
export default User;
