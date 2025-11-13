import {Hono} from "hono";
import {loginUser, registerUser, validateUserToken} from "../controllers/auth.controller";

const authRoutes = new Hono();


authRoutes.post('/register', registerUser);
authRoutes.post('/login', loginUser);
authRoutes.get('/validate', validateUserToken);


export default authRoutes;