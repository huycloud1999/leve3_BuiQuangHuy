import { Router } from "express";
import AuthRouter from "./auth.js";
import AdminRouter from "./admin.js";
import UserRouter from "./user.js";
const CombineRouter =Router();
CombineRouter.use('/auth',AuthRouter)
CombineRouter.use('/admin',AdminRouter)
CombineRouter.use('/user',UserRouter)
export default CombineRouter