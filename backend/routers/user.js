import {Router} from "express";
import { UserInfoUpdate, UserInfoUpdateAvt, UserInfoUpdatePassword } from "../controllers/userController.js";
const UserRouter =Router();
UserRouter.put('/update', UserInfoUpdate);
UserRouter.put('/updatepassword', UserInfoUpdatePassword);
UserRouter.post('/updateavt', UserInfoUpdateAvt);
export default UserRouter