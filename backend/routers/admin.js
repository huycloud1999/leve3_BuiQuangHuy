import {Router} from "express";
import { getAllUsers } from "../controllers/adminController.js";
const AdminRouter =Router();

AdminRouter.get('/users',getAllUsers)

export default AdminRouter