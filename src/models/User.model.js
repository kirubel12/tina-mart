import {Schema, model} from "mongoose";
import jwt from 'jsonwebtoken';
import {ENV} from '../config/env.js'; // assuming ENV is defined in a separate file

const userSchema = new Schema({
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/.+\@.+\..+/, 'Please fill a valid email address'],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    phone: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      default: '',
    },
    refreshToken: {
      type: String,
      select: false,
    },
    refreshTokenExpiry: {
      type: Date,
      select: false,
    }
  },
  {
    timestamps: true,
  });

// Add method to generate tokens
userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    { id: this._id, role: this.role },
    ENV.JWT_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { id: this._id },
    ENV.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );

  return { token, refreshToken };
};

export const User = model('User', userSchema);
