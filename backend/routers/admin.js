import {Router} from "express";
import { getAllUsers,addLocation, addWeatherInfo, getAllLocation, getWeatherData, updateUser } from "../controllers/adminController.js";
import checkAdmin from "../middleware/checkAdmin.js";

const AdminRouter =Router();

AdminRouter.get('/users',checkAdmin,getAllUsers)
AdminRouter.get('/locations',checkAdmin,getAllLocation)
AdminRouter.get('/locations/weatherdata',checkAdmin,getWeatherData)
AdminRouter.post('/addlocation',checkAdmin,addLocation)
AdminRouter.post('/addweatherdata',checkAdmin,addWeatherInfo)
AdminRouter.put('/updateuser/:id',checkAdmin,updateUser)


export default AdminRouter