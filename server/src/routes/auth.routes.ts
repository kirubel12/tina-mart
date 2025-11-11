import {Hono} from "hono";
import {loginUser, registerUser} from "../controllers/auth.controller.js";

const authRoutes = new Hono();


authRoutes.post('/register', registerUser);
authRoutes.post('/login', loginUser);


export default authRoutes;