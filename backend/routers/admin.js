import {Router} from "express";
import { getAllUsers,addLocation, addWeatherInfo, getAllLocation, getWeatherData, updateUser, deleteUser, deleteLocation, updateLocation, deleteWeatherdata, updateWeatherData } from "../controllers/adminController.js";
import checkAdmin from "../middleware/checkAdmin.js";

const AdminRouter =Router();

AdminRouter.get('/users',checkAdmin,getAllUsers)
AdminRouter.get('/locations',checkAdmin,getAllLocation)
AdminRouter.get('/locations/weatherdata',checkAdmin,getWeatherData)
AdminRouter.post('/addlocation',checkAdmin,addLocation)
AdminRouter.post('/addweatherdata',checkAdmin,addWeatherInfo)
AdminRouter.put('/updateuser/:id',checkAdmin,updateUser)
AdminRouter.put('/updateweatherdata/:id',checkAdmin,updateWeatherData)
AdminRouter.delete('/deleteuser/:id',checkAdmin,deleteUser)
AdminRouter.delete('/deletelocation/:id',checkAdmin,deleteLocation)
AdminRouter.delete('/deleteweatherdata/:id',checkAdmin,deleteWeatherdata)
AdminRouter.put('/updatelocation/:id',checkAdmin,updateLocation)


export default AdminRouter