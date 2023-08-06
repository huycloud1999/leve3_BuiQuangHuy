import {Router} from "express";
import { signUp,signIn,UserInfo } from "../controllers/userController.js";
const AuthRouter =Router();
AuthRouter.post('/signup', signUp);
AuthRouter.post('/signin',signIn);
AuthRouter.get('/user-info', UserInfo);

export default AuthRouter