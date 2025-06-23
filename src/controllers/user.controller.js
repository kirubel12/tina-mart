import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import {User} from "../models/User.model.js";
import {ENV} from "../config/env.js";


export const userRegister = async (req,res) => {
    const {name,email,password, phone, address} = req.body;
    if(!name || !email || !password || !phone || !address){
        return res.status(400).json({status:false,message:"All fields are required"})
    }
    try {
        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.status(409).json({status:false,message:"Email already exists"})
        }
        const hashedPassword = await bcryptjs.hash(password,12)
        const user = await User.create({name,email,password:hashedPassword,phone,address})
        res.status(201).json({status:true,message:"User registered successfully",user})
    } catch (error) {
        res.status(500).json({status:false,message:"Internal server error",error:error.message})
    }
}


export const userLogin = async (req,res) => {
    const {email,password} = req.body;
    if(!email || !password){
        return res.status(400).json({status:false,message:"All fields are required"})
    }
    try {
        const user = await User.findOne({email}).select("+password")
        if(!user){
            return res.status(404).json({status:false,message:"User not found"})
        }
        const isPasswordMatch = await bcryptjs.compare(password,user.password)
        if(!isPasswordMatch){
            return res.status(401).json({status:false,message:"Invalid credentials"})
        }
        const token = jwt.sign({id:user._id,name:user.name,email:user.email},ENV.JWT_SECRET,{expiresIn:"1d"})
        res.status(200).json({status:true,message:"User logged in successfully",user,token})
    } catch (error) {
        res.status(500).json({status:false,message:"Internal server error",error:error.message})
    }
}

export const userLogout = async (req,res) => {
    try {
        res.clearCookie("token")
        res.status(200).json({status:true,message:"User logged out successfully"})
    } catch (error) {
        res.status(500).json({status:false,message:"Internal server error",error:error.message})
    }
}
