import {Router} from "express";
import { UserInfoUpdate, UserInfoUpdateAvt, UserInfoUpdatePassword, getLocationName, getWeatherDataDate, getWeatherDataMap, getWeatherDataNext, setLocationDefault } from "../controllers/userController.js";
const UserRouter =Router();
UserRouter.put('/update', UserInfoUpdate);
UserRouter.put('/updatepassword', UserInfoUpdatePassword);
UserRouter.post('/setlocation', setLocationDefault);
UserRouter.post('/updateavt', UserInfoUpdateAvt);
UserRouter.post('/weatherinfo', getWeatherDataDate);
UserRouter.post('/weatherinfonext', getWeatherDataNext);
UserRouter.post('/search', getLocationName);
UserRouter.get('/map', getWeatherDataMap);
export default UserRouter