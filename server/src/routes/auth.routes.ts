import {Hono} from "hono";
import {registerUser} from "../controllers/auth.controller.js";

const authRoutes = new Hono();


authRoutes.post('/register', registerUser);


export default authRoutes;