import express from "express"
import { userRegister, userLogin, userLogout } from "../controllers/user.controller.js"

const authRoute = express.Router()

authRoute.post("/register",userRegister)
authRoute.post("/login",userLogin)
authRoute.post("/logout",userLogout)

export default authRoute
